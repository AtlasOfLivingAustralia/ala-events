import lodash from 'lodash';
import taxonResolver from './taxon.resolver.js';
import taxonDetailsResolver from './taxonDetails.resolver.js';
import taxonTypeDef from './taxon.type.js';
import taxonDetailsTypeDef from './taxonDetails.type.js';
import taxonAPI from './taxon.source.js';
const { merge } = lodash;

export default {
  resolver: merge({}, taxonResolver, taxonDetailsResolver),
  typeDef: [taxonTypeDef, taxonDetailsTypeDef],
  dataSource: {
    taxonAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
