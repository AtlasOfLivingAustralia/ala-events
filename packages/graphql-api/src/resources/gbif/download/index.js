import downloadAPI from './download.source.js';
import resolver from './download.resolver.js';
import typeDef from './download.type.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    downloadAPI,
  },
};
