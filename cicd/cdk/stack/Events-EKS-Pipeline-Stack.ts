import { AlaPipeline, AppContext, BaseStack, StackConfig } from "@ala/ala-cdk-libs";

import * as codebuild from 'aws-cdk-lib/aws-codebuild';r
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as ecr  from "aws-cdk-lib/aws-ecr";
import * as iam from 'aws-cdk-lib/aws-iam';

import { EventsAPIStack } from "./Events-API-Stack";
import { Stack } from "aws-cdk-lib";


export class EventsEksDeploymentPipelineStack extends BaseStack {

    readonly pipeline: AlaPipeline;

    constructor(appContext: AppContext, stackConfig: StackConfig) {

        super(appContext, stackConfig);

        const imageTagVariable = new codepipeline.Variable({ variableName: 'IMAGE_TAG', defaultValue: 'latest' })

        this.pipeline = new AlaPipeline(this, {
            variables: [ 
                imageTagVariable,
            ]
        })

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

        // Create an IAM role for CodeBuild
        const codeBuildRole = new iam.Role(this, 'CodeBuildRole', {
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
            description: 'Role for CodeBuild to access AWS Systems Manager Parameter Store',
        })

        this.pipeline.addStage({
            stageName: 'Deploy-Events-UI',
            actions: [
                new codepipeline_actions.CodeBuildAction({
                    actionName: 'Build-Events-UI',
                    project: new codebuild.PipelineProject(this, 'deploy HELM', {
                        role: codeBuildRole,
                        environment: {
                            buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_4
                        },
                        buildSpec: codebuild.BuildSpec.fromObject({
                            version: '0.2',
                            env: {
                                shell: 'bash',
                                variables: {
                                    JAVA_TOOL_OPTIONS: '-Dhttps.protocols=TLSv1.2'
                                },
                            },
                          
                          phases: {
                            install: {
                              commands: [
                                'echo Installing dependencies...',
                                'curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3',
                                'chmod 700 get_helm.sh',
                                './get_helm.sh'
                              ]
                              },
                            build: {
                              commands: [
                                'echo Build started on $(date)',
                                'aws eks update-kubeconfig --name $EKS_CLUSTER_NAME',
                                'cd helm',
                                'helm upgrade --install $HELM_RELEASE_NAME . \\' +
                                '  -n events \\' +
                                '  --set esApi.image.repository=748909248546.dkr.ecr.ap-southeast-2.amazonaws.com/es-api \\' +
                                '  --set graphqlApi.image.repository=748909248546.dkr.ecr.ap-southeast-2.amazonaws.com/graphql-api \\' +
                                '  --set es2vt.image.repository=748909248546.dkr.ecr.ap-southeast-2.amazonaws.com/es2vt \\' +
                                '  --set esApi.apiKey=cb812471-8751-4b6a-9f54-41a08d674144 \\' +
                                '  --set elasticsearch.pv.volumeHandle=fs-0ac5848e7bb206a0a \\' +
                                '  --set ingress.hostname=events-api.dev.ala.org.au'
                              ]
                            }
                        },

                        })
                    }),
                    input: sourceArtifact,
                    outputs: [buildArtifact],
                    runOrder: 1
                })
            ]
        })
    }
}