import resolver from './occurrence.resolver.js';
import typeDef from './occurrence.type.js';
import searchTypeDef from './occurrenceSearch.type.js';
import searchClusterTypeDef from './occurrenceClusterSearch.type.js';
import occurrenceAPI from './occurrence.source.js';

export default {
  resolver,
  typeDef: [typeDef, searchTypeDef, searchClusterTypeDef],
  dataSource: {
    occurrenceAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
