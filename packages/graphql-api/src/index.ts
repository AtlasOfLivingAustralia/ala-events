import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { ApolloServer, ApolloServerPlugin, BaseContext } from '@apollo/server';
import mapController from './api-utils/maps/index.ctrl.js';
import { DataSource } from 'apollo-datasource';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';

import AbortControllerServer from 'abort-controller';
import { get } from 'lodash';
// recommended in the apollo docs https://github.com/stems/graphql-depth-limit
import depthLimit from 'graphql-depth-limit';

// Local imports
import config from './config';
import { hashMiddleware, mutateQuery } from './middleware';
import health from './health';
// get the full schema of what types, enums, scalars and queries are available
import getSchema from './typeDefs';
// define how to resolve the various types, fields and queries
import resolvers from './resolvers';
// how to fetch the actual data and possible format/remap it to match the schemas
import api from './dataSources';
// we will attach a user if an authorization header is present.
import extractUser from './helpers/auth/extractUser';

type DataSources = Record<string, DataSource>;
type DataSourcesFn = () => DataSources;
interface ContextWithDataSources extends BaseContext {
  dataSources?: DataSources;
}

export const ApolloDataSources = (options: {
  dataSources: DataSourcesFn,
}): ApolloServerPlugin<ContextWithDataSources> => ({
  requestDidStart: async (requestContext) => {
    const dataSources = options.dataSources();
    const initializers = Object.values(dataSources).map(async (dataSource) => {
      if (dataSource.initialize)
        dataSource.initialize({
          cache: requestContext.cache,
          context: requestContext.contextValue,
        });
    });
    await Promise.all(initializers);
    requestContext.contextValue.dataSources = dataSources;
  },
});

const dataSourcesFn = () => Object.keys(api).reduce(
  (prev, cur) => ({
    ...prev,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [cur]: new (api as { [key: string]: any })[cur](config),
  }),
  {},
);

// we are doing this async as we need to load the various enumerations from the APIs
// and generate the schema from those
async function initializeServer() {
  // this is async as we generate parts of the schema from the live enumeration API
  const typeDefs = await getSchema();
  const server = new ApolloServer({
    includeStacktraceInErrorResponses: config.debug,
    typeDefs,
    resolvers,
    validationRules: [depthLimit(14)], // this likely have to be much higher than 6, but let us increase it as needed and not before
    plugins: [
      ApolloServerPluginCacheControl({
        defaultMaxAge: config.debug ? 0 : 600,
      }),
      ApolloDataSources(({ dataSources: dataSourcesFn }))
    ],
  });

  const app = express();
  app.use(compression());
  app.use(
    cors({
      methods: 'GET,POST,OPTIONS',
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

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = await extractUser(get(req, 'headers.authorization'));

        const controller = new AbortControllerServer();
        req.on('close', () => {
          controller.abort();
        });

        return {
          user,
          abortController: controller,
          userAgent: get(req, 'headers.User-Agent') || 'GBIF_GRAPHQL_API',
          referer: get(req, 'headers.referer') || null,
        };
      },
    }),
  );

  app.listen(config.port, () =>
    console.log(`🚀 Server ready at http://localhost:${config.port}/graphql`),
  );
}

initializeServer();
