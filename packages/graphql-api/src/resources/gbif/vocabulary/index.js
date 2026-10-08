import resolver from './vocabulary.resolver.js';
import typeDef from './vocabulary.type.js';
import vocabularyAPI from './vocabulary.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    vocabularyAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
