import resolver from './gadm.resolver.js';
import typeDef from './gadm.type.js';
import gadmAPI from './gadm.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    gadmAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
