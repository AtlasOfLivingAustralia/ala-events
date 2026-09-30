import datasetAPI from './dataset.source.js';
import * as resolver from './dataset.resolver.js';
import typeDef from './dataset.type.js';
import checklistBankTypeDef from './checklistBankDataset.type.js';

export default {
  resolver,
  typeDef: [typeDef, checklistBankTypeDef],
  dataSource: {
    datasetAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
  },
};
