import * as article from './article/index.js';
import * as call from './call/index.js';
import * as composition from './composition/index.js';
import * as dataUse from './dataUse/index.js';
import * as event from './event/index.js';
import * as gbifDocument from './document/index.js';
import * as gbifProject from './gbifProject/index.js';
import * as programme from './programme/index.js';
import * as help from './help/index.js';
import * as news from './news/index.js';
import * as notification from './notification/index.js';
import * as resourceSearch from './resourceSearch/index.js';
import * as resource from './resource/index.js';
import * as tool from './tool/index.js';
import * as misc from './misc/index.js';
import * as menuItem from './menuItem/index.js';
import * as home from './home/index.js';
import * as fundingOrganisation from './fundingOrganisation/index.js';
import { ResourceAPI, ResourceSearchAPI } from './resource.source.js';
import lodash from 'lodash';
const { merge, get } = lodash;

const children = [
  article,
  call,
  composition,
  dataUse,
  event,
  gbifDocument,
  gbifProject,
  programme,
  help,
  news,
  notification,
  resourceSearch,
  resource,
  tool,
  misc,
  menuItem, 
  home,
  fundingOrganisation,
].map(resource => resource.default);

export default {
  resolver: Object.keys(children).reduce(
    (agg, resource) =>
      merge(agg, get(children, `${resource}.resolver`)),
    {},
  ),
  typeDef: children.map(resource => resource.typeDef),
  dataSource: merge(
    {
      resourceAPI: ResourceAPI,
      resourceSearchAPI: ResourceSearchAPI,
    },
    Object.keys(children).reduce(
      (agg, resource) =>
        merge(agg, get(resource, `${resource}.dataSource`)),
      {},
    ),
  )
}