import resolver from './organization.resolver.js';
import typeDef from './organization.type.js';
import organizationAPI from './organization.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    organizationAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
