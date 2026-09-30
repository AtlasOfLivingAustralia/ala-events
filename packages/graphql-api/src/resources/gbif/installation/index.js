import resolver from './installation.resolver.js';
import typeDef from './installation.type.js';
import installationAPI from './installation.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    installationAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
