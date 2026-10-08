import resolver from './institution.resolver.js';
import typeDef from './institution.type.js';
import institutionAPI from './institution.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    institutionAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
