import resolver from './network.resolver.js';
import typeDef from './network.type.js';
import networkAPI from './network.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    networkAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
