import resolver from './participant.resolver.js';
import typeDef from './participant.type.js';
import participantAPI from './participant.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    participantAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
