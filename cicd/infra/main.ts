#!/usr/bin/env node
import 'source-map-support/register';
//import { ... } from './stack/...-stack';
import { AppContext, AppContextError, PipelineBaseStack, ProjectPrefixType } from '@ala/ala-cdk-libs';
import { EventsUIStack } from './stack/Events-UI-Stack';
import { EventsPipelineStack } from './stack/Pipeline-Stack';

try {

    const appContext = new AppContext({
        appConfigFileKey: 'APP_CONFIG',
        projectPrefixType: ProjectPrefixType.NameHyphenStage,
    });

    new EventsUIStack(appContext, appContext.appConfig.Stack.EventsUI);

    new EventsPipelineStack(appContext, appContext.appConfig.Stack.Pipeline);

} catch (error) {
    if (error instanceof AppContextError) {
        console.error('[AppContextError]:', (error as AppContextError).message);
    } else {
        console.error('[Error]: not-handled-error', error);
    }
}