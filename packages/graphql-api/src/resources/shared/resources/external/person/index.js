import resolver from './person.resolver.js';
import typeDef from './person.type.js';
import personAPI from './person.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    personAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
