import { AlaPipeline, AppContext, BaseStack, StackConfig } from "@ala/ala-cdk-libs";

import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as ecr  from "aws-cdk-lib/aws-ecr";
import * as iam from 'aws-cdk-lib/aws-iam';

import { EventsAPIStack } from "./Events-API-Stack";
import { Stack } from "aws-cdk-lib";


export class EventsApiPipelineStack extends BaseStack {

    readonly pipeline: AlaPipeline;

    constructor(appContext: AppContext, stackConfig: StackConfig) {

        super(appContext, stackConfig);

        console.log('pipeline', this.withProjectPrefix('Pipeline'))

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

        const eventsApiStack: EventsAPIStack = stackConfig.eventsApiStack

        this.pipeline.addCdkStage({
            configPath: 'cdk/config',
            configFile: `events-${appContext.appConfig.Project.Stage}.yaml`,
            stackName: eventsApiStack.stackName,
        })

        // Create an IAM role for CodeBuild
        const codeBuildRole = new iam.Role(this, 'CodeBuildRole', {
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
            description: 'Role for CodeBuild to access AWS Systems Manager Parameter Store',
        });

        // Attach a policy to the role for accessing SSM Parameter Store
        codeBuildRole.addToPolicy(new iam.PolicyStatement({
            actions: [ 'ecr:GetAuthorizationToken' ],
            resources: [ '*' ],
            // Use '*' in resources to allow access to all parameters, or specify individual parameter ARNs for finer control
        }));

        eventsApiStack.esApiRepo.grantPullPush(codeBuildRole)
        eventsApiStack.es2vtRepo.grantPullPush(codeBuildRole)
        eventsApiStack.graphqlApiRepo.grantPullPush(codeBuildRole)

        const buildProject = new codebuild.PipelineProject(this, `docket-image-build`, {
            role: codeBuildRole,
            environment: {
                buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_4
            },
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    pre_build: {
                        commands: [
                            'cd packages/$COMPONENT_NAME',
                            'echo Logging in to Amazon ECR...',
                            'aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $REPOSITORY_URI',
                        ]
                    },
                    build: {
                        commands: [
                            'echo Build started on `date`',
                            'echo Building the Docker image...',
                            'docker build -t $REPOSITORY_URI:latest .',
                            'docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION'                          
                        ]
                    },
                    post_build: {
                        commands: [
                            'echo Build completed on `date`',
                            'echo Pushing the Docker image...',
                            'docker push $REPOSITORY_URI:latest',
                            'docker push $REPOSITORY_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION',
                        ]
                    }                          
                },
                artifacts: {
                    'base-directory': 'packages/$COMPONENT_NAME',
                    files: [ '**/*' ]
                }
            })
        })

        this.pipeline.addStage({
            stageName: 'Build-Events-API',
            actions: [
                new codepipeline_actions.CodeBuildAction({
                    actionName: 'Build-es-api',
                    environmentVariables: {
                        "COMPONENT_NAME": {
                            value: 'es-api'
                        },
                        'REPOSITORY_URI': {
                            value: eventsApiStack.esApiRepo.repositoryUri,
                        },
                    },
                    project: buildProject,
                    input: sourceArtifact,
                    runOrder: 1
                }),
                new codepipeline_actions.CodeBuildAction({
                    actionName: 'Build-es2vt',
                    environmentVariables: {
                        "COMPONENT_NAME": {
                            value: 'es2vt'
                        },
                        'REPOSITORY_URI': {
                            value: eventsApiStack.es2vtRepo.repositoryUri,
                        },
                    },
                    project: buildProject,
                    input: sourceArtifact,
                    runOrder: 1
                }),
                new codepipeline_actions.CodeBuildAction({
                    actionName: 'Build-graphql-api',
                    environmentVariables: {
                        "COMPONENT_NAME": {
                            value: 'graphql-api'
                        },
                        'REPOSITORY_URI': {
                            value: eventsApiStack.graphqlApiRepo.repositoryUri,
                        },
                    },
                    project: buildProject,
                    input: sourceArtifact,
                    runOrder: 1
                })
            ]
        })

        // this.pipeline.addStage({
        //     stageName: 'Deploy-Events-API',
        //     actions: [

        //     ]
        // })
    }
}