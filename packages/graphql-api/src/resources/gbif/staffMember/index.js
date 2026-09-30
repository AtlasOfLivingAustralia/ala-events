import resolver from './staffMember.resolver.js';
import typeDef from './staffMember.type.js';
import staffMemberAPI from './staffMember.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    staffMemberAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
