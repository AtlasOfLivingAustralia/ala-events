import { AlaPipeline, AppContext, BaseStack, StackConfig } from "@ala/ala-cdk-libs";
import { Stack } from "aws-cdk-lib";

import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';

export class EventsPipelineStack extends BaseStack {

    readonly pipeline: AlaPipeline;

    constructor(appContext: AppContext, stackConfig: StackConfig) {

        super(appContext, stackConfig);

        this.pipeline = new AlaPipeline(this)

        const sourceArtifact = this.pipeline.getSourceArtifact()
        const buildArtifact = new codepipeline.Artifact()

        this.pipeline.addSourceStage(sourceArtifact, {
            connectionArn: stackConfig.Parameters.connectionArn,
            owner: stackConfig.Parameters.owner,
            repo: stackConfig.Parameters.repo,
            branch: stackConfig.Parameters.branch,
            codeBuildCloneOutput: false,
            triggerOnPush: true
        })

        const eventsUiStack = stackConfig.eventsUiStack

        this.pipeline.addCdkStage({
            configPath: 'cdk/config',
            configFile: `events-${appContext.appConfig.Project.Stage}.yaml`,
            stackName: eventsUiStack.stackName,
        })

        const stage = appContext.appConfig.Project.Stage
        const stageTitle = stage[0].toUpperCase() + stage.substring(1).toLowerCase()

        const ssmBasePath = `/${stageTitle}/CodeBuild/${appContext.appConfig.Project.Name}`

        // Create an IAM role for CodeBuild
        const codeBuildRole = new iam.Role(this, 'CodeBuildRole', {
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
            description: 'Role for CodeBuild to access AWS Systems Manager Parameter Store',
        });

        // Attach a policy to the role for accessing SSM Parameter Store
        codeBuildRole.addToPolicy(new iam.PolicyStatement({
            actions: [ 'ssm:GetParameter', 'ssm:GetParameters'],
            resources: [ Stack.of(this).formatArn({ service: 'ssm', resource: `parameter${ssmBasePath}/*` }) ],
            // Use '*' in resources to allow access to all parameters, or specify individual parameter ARNs for finer control
        }));

        const invalidateCache = new codebuild.PipelineProject(this, 'invalidate-cache', {
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    build: {
                        commands: [
                            'aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"'
                        ]
                    }
                }
            }),
            environmentVariables: {
                CLOUDFRONT_ID: { value: eventsUiStack.eventsSpa.distribution.distributionId }
            }
        })

        invalidateCache.addToRolePolicy(new iam.PolicyStatement({
            resources: [ Stack.of(this).formatArn({ service: 'cloudfront', region: '', resource: `distribution/${eventsUiStack.eventsSpa.distribution.distributionId}` }) ],
            actions: [ 'cloudfront:CreateInvalidation' ]
        }))

        this.pipeline.addStage({
            stageName: 'Deploy-Events-UI',
            actions: [
                new codepipeline_actions.CodeBuildAction({
                    actionName: 'Build-Events-UI',
                    project: new codebuild.PipelineProject(this, 'react-build', {
                        role: codeBuildRole,
                        environment: {
                            buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_4
                        },
                        buildSpec: codebuild.BuildSpec.fromObject({
                            version: '0.2',
                            env: {
                                'parameter-store': {
                                    'ENV_JSON': `${ssmBasePath}/env.json`,
                                    'CONGIG_JS': `${ssmBasePath}/config.js`
                                }
                            },
                            phases: {
                                install: {
                                    'runtime-versions': {
                                        nodejs: 16
                                    }
                                },
                                pre_build: {
                                    commands: [
                                        'cd packages/react-components',
                                        'npm install'
                                    ]
                                },
                                build: {
                                    commands: [
                                        'echo $ENV_JSON > .env.json',
                                        'echo $CONGIG_JS > config.js',
                                        'npm run build-translations',
                                        'npm run build'
                                    ]
                                },
                            },
                            artifacts: {
                                'base-directory': 'packages/react-components',
                                files: [
                                    'ala-demo.html',
                                    'config.js',
                                    'dist/**/*'
                                ]
                            }
                        })
                    }),
                    input: sourceArtifact,
                    outputs: [ buildArtifact ],
                    runOrder: 1
                }),
                new codepipeline_actions.S3DeployAction({
                    actionName: 'Deploy-Events-UI',
                    input: buildArtifact,
                    bucket: eventsUiStack.eventsSpa.bucket,
                    runOrder: 2
                }),
                new codepipeline_actions.CodeBuildAction({
                    actionName: 'Invalidate-Events-UI-cache',
                    project: invalidateCache,
                    input: buildArtifact,
                    runOrder: 3
                })
            ]
        })
    }
}