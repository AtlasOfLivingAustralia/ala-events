import { AppContext, BaseStack, StackConfig, StaticSpa } from "@ala/ala-cdk-libs";

export class EventsUIStack extends BaseStack {

    constructor(appContext: AppContext, stackConfig: StackConfig) {

        super(appContext, stackConfig);

        const eventsUI = new StaticSpa(this, 'EventsUI', {
        })
    }
}