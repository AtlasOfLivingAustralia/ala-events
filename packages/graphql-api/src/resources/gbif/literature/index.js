import resolver from './literature.resolver.js';
import typeDef from './literature.type.js';
import literatureAPI from './literature.source.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    literatureAPI,
  },
};
