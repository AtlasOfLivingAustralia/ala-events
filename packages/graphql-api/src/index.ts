import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { ApolloServer, type ApolloServerPlugin, type BaseContext } from '@apollo/server';
import mapController from './api-utils/maps/index.ctrl.js';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';

import lodash from 'lodash';
// recommended in the apollo docs https://github.com/stems/graphql-depth-limit
import depthLimit from 'graphql-depth-limit';

// Local imports
import config from './config.js';
import { hashMiddleware, mutateQuery } from './middleware/index.ts';
import health from './health/index.js';
// get the full schema of what types, enums, scalars and queries are available
import getSchema from './typeDefs.js';
// define how to resolve the various types, fields and queries
import resolvers from './resolvers.js';
// how to fetch the actual data and possible format/remap it to match the schemas
import api from './dataSources.js';
// we will attach a user if an authorization header is present.
import extractUser from './helpers/auth/extractUser.js';
import ipController from './api-utils/ip2country.ctrl.js';
import polygonName from './api-utils/polygonName.ctrl.js';
import { loggingPlugin } from './plugins/loggingPlugin.ts';
const { get } = lodash;

interface ContextWithDataSources extends BaseContext {
  dataSources?: Record<string, unknown>;
  user?: unknown;
  abortController?: AbortController;
  userAgent?: string;
  referer?: string | null;
  locale?: string;
  preview?: boolean;
}

// we are doing this async as we need to load the various enumerations from the APIs
// and generate the schema from those
async function initializeServer() {
  // this is async as we generate parts of the schema from the live enumeration API
  const typeDefs = await getSchema();
  const server = new ApolloServer<ContextWithDataSources>({
    includeStacktraceInErrorResponses: config.debug,
    typeDefs,
    resolvers,
    validationRules: [depthLimit(14)], // this likely have to be much higher than 6, but let us increase it as needed and not before
    plugins: [
      ApolloServerPluginCacheControl({
        defaultMaxAge: config.debug ? 0 : 600,
      }),
      // Keep loggingPlugin disabled until both logging paths redact sensitive headers.
    ],
    logger: console,
  });

  const app = express();
  app.use(compression());
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight'],
    }),
  );
  app.use(express.static('public'));
  app.use(express.json());
  app.use(mutateQuery);

  // extract query and variables from store if a hash is provided instead of a query or variable
  app.use('/graphql', hashMiddleware);

  // link to query and variables
  app.get('/getIds', (req, res) => {
    res.json({
      queryId: res.get('X-Graphql-query-ID'),
      variablesId: res.get('X-Graphql-variables-ID'),
    });
  });

  app.get('/health', health);

  // utils for map styles
  mapController(app);
  ipController(app);
  polygonName(app);

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = await extractUser(get(req, 'headers.authorization'));

        const controller = new AbortController();
        req.on('close', () => {
          controller.abort();
        });

        const contextValue: ContextWithDataSources = {
          user,
          abortController: controller,
          userAgent: String(get(req, 'headers.user-agent') || 'GBIF_GRAPHQL_API'),
          referer: (get(req, 'headers.referer') as string | undefined) || null,
          locale: String(get(req, 'headers.locale') || 'en-GB'),
          preview: get(req, 'headers.preview') === 'true',
        };

        contextValue.dataSources = Object.keys(api).reduce(
          (prev, cur) => ({
            ...prev,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [cur]: new (api as { [key: string]: any })[cur]({
              cache: server.cache,
              context: contextValue,
              config,
            }),
          }),
          {},
        );

        return contextValue;
      },
    }),
  );

  app.listen(config.port, () =>
    console.log(`🚀 Server ready at http://localhost:${config.port}/graphql`),
  );
}

initializeServer();
