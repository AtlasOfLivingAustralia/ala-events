import resolver from './directoryPerson.resolver.js';
import typeDef from './directoryPerson.type.js';
import directoryPersonAPI from './directoryPerson.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    directoryPersonAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
