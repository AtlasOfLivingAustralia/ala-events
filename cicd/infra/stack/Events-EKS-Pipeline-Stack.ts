import { AlaPipeline, AppContext, BaseStack, StackConfig } from "@ala/ala-cdk-libs";

import * as codebuild from 'aws-cdk-lib/aws-codebuild';
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

        // const eventsApiStack: EventsAPIStack = stackConfig.eventsApiStack

        // this.pipeline.addCdkStage({
        //     configFile: `events-${appContext.appConfig.Project.Stage}.yaml`,
        //     stackName: eventsApiStack.stackName,
        // })

    }
}