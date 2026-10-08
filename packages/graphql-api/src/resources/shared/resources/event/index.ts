import resolver from './event.resolver.js';
import typeDef from './event.type.js';
import eventAPI from './event.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    eventAPI,
  },
};
