import resolver from './node.resolver.js';
import typeDef from './node.type.js';
import nodeAPI from './node.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    nodeAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
