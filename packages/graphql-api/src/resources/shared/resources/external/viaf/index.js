import resolver from './viaf.resolver.js';
import typeDef from './viaf.type.js';
import viafAPI from './viaf.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    viafAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
