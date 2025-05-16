#!/usr/bin/env node
import 'source-map-support/register';
import { AppContext, AppContextError, PipelineBaseStack, ProjectPrefixType } from '@ala/ala-cdk-libs';
import { EventsUIStack } from './stack/Events-UI-Stack';
import { EventsPipelineStack } from './stack/Pipeline-Stack';
import { EventsAPIStack } from './stack/Events-API-Stack';
import { EventsApiPipelineStack } from './stack/Events-API-Pipeline-Stack';
import { EventsEksDeploymentPipelineStack } from './stack/Events-EKS-Pipeline-Stack';
import { EventsEKSStack as EventsEksStack } from './stack/Events-EKS-Stack';

try {

    const appContext = new AppContext({
        appConfigFileKey: 'APP_CONFIG',
        projectPrefixType: ProjectPrefixType.NameHyphenStage,
    });

    const eventUIStack = new EventsUIStack(appContext, appContext.appConfig.Stack.EventsUI);

    const eventsAPIStack = new EventsAPIStack(appContext, appContext.appConfig.Stack.EventsAPI);

    new EventsPipelineStack(appContext, { 
        eventsUiStack: eventUIStack,
        ...appContext.appConfig.Stack.Pipeline 
    });

    new EventsApiPipelineStack(appContext, {
        eventsApiStack: eventsAPIStack,
        ...appContext.appConfig.Stack.EventsAPIPipeline
    })

    new EventsEksStack(appContext, {
        ...appContext.appConfig.Stack.EventsEks
    })

} catch (error) {
    if (error instanceof AppContextError) {
        console.error('[AppContextError]:', (error as AppContextError).message);
    } else {
        console.error('[Error]: not-handled-error', error);
    }
}