import wikidataAPI from './wikidata.source.js';
import resolver from './wikidata.resolver.js';
import typeDef from './wikidata.type.js';

export default {
  resolver,
  typeDef,
  dataSource: {
    wikidataAPI,
  },
};
