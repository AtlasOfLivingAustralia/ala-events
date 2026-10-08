import lodash from 'lodash';
import * as resources from './resources/index.ts';
import config from './config.js';
const { get, merge } = lodash;

const organization = config.organization;

// Merge the resovers defined for that organisation
const resolvers = Object.keys(resources[organization]).reduce(
  (agg, resource) =>
    merge(agg, get(resources, `${organization}.${resource}.resolver`)),
  {},
);

export default resolvers;
