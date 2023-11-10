import * as article from './article';
import * as call from './call';
import * as composition from './composition';
import * as dataUse from './dataUse';
import * as event from './event';
import * as gbifDocument from './document';
import * as gbifProject from './gbifProject';
import * as help from './help';
import * as news from './news';
import * as notification from './notification';
import * as resourceSearch from './resourceSearch';
import * as tool from './tool';
import * as misc from './misc';
import { ResourceAPI, ResourceSearchAPI } from './resource.source';
import { merge, get } from 'lodash';

const children = [
  article,
  call,
  composition,
  dataUse,
  event,
  gbifDocument,
  gbifProject,
  help,
  news,
  notification,
  resourceSearch,
  tool,
  misc,
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