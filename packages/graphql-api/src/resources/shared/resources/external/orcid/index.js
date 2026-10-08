import resolver from './orcid.resolver.js';
import typeDef from './orcid.type.js';
import orcidAPI from './orcid.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    orcidAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
