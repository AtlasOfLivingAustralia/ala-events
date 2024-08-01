import { AlaPipeline, AppContext, BaseStack, StackConfig } from "@ala/ala-cdk-libs";

import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';

import { EventsAPIStack } from "./Events-API-Stack";

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
            configFile: `events-${appContext.appConfig.Project.Stage}.yaml`,
            stackName: eventsApiStack.stackName,
        })

        this.pipeline.addStage({
            stageName: 'Build-Events-API',
            actions: [
                new codepipeline_actions.CodeBuildAction({
                    actionName: 'Build-Events-es-api',
                    project: new codebuild.PipelineProject(this, 'es-api-build', {
                        environment: {
                            buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_4
                        },
                         environmentVariables: {
                            'REPOSITORY_URI': {
                            value: eventsApiStack.esApiRepo.repositoryUri,
                            },
                        },
                        buildSpec: codebuild.BuildSpec.fromObject({
                            version: '0.2',
                            phases: {
                                install: {
                                    'runtime-versions': {
                                        nodejs: 16
                                    }
                                },
                                pre_build: {
                                    commands: [
                                        'cd packages/es-api',
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
                                'base-directory': 'packages/ep-api',
                                files: [ '**/*' ]
                            }
                        })
                    }),
                    input: sourceArtifact,
                    outputs: [ buildArtifact ],
                    runOrder: 1
                })
            ]
        })
    }
}