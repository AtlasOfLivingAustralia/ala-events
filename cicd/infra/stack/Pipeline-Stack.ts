import { AlaPipeline, AppContext, BaseStack, StackConfig } from "@ala/ala-cdk-libs";

export class EventsPipelineStack extends BaseStack {

    readonly pipeline: AlaPipeline;

    constructor(appContext: AppContext, stackConfig: StackConfig) {

        super(appContext, stackConfig);

        this.pipeline = new AlaPipeline(this)

        const sourceArtifact = this.pipeline.getSourceArtifact()

        this.pipeline.addSourceStage(sourceArtifact, {
            connectionArn: stackConfig.Parameters.connectionArn,
            owner: stackConfig.Parameters.owner,
            repo: stackConfig.Parameters.repo,
            branch: stackConfig.Parameters.branch,
            codeBuildCloneOutput: false,
            triggerOnPush: true
        })

        this.pipeline.addCdkStage({
            configFile: `events-${appContext.appConfig.Project.Stage}.yaml`,
            stackName: this.withProjectPrefix('UI'),
        })
    }
}