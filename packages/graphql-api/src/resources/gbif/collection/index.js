import collectionAPI from './collection.source.js';
import resolver from './collection.resolver.js';
import typeDef from './collection.type.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    collectionAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
