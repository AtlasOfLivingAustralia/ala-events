export { default as collection } from './collection/index.js';
// export { default as country } from './country/index.js';
export { default as dataset } from './dataset/index.js';
export { default as download } from './download/index.js';
export { default as installation } from './installation/index.js';
export { default as institution } from './institution/index.js';
export { default as literature } from './literature/index.js';
export { default as misc } from './misc/index.js';
export { default as network } from './network/index.js';
export { default as node } from './node/index.js';
export { default as occurrence } from './occurrence/index.js';
export { default as wikidata } from './wikidata/index.js';
export { default as organization } from './organization/index.js';
export { default as participant } from './participant/index.js';
export { default as staffMember } from './staffMember/index.js';
export { default as taxon } from './taxon/index.js';
export { default as vocabulary } from './vocabulary/index.js';
export { default as gadm } from './gadm/index.js';
export { default as resource } from './resource/index.js';
export { default as directoryPerson } from './directoryPerson/index.js';

// experimental taxonmedia service. The idea it to provide a few high quality images per taxon
export { default as taxonMedia } from '../shared/resources/taxonMedia/index.js';
export { default as taxonMediaAPI } from './taxon/taxonMediaAPI.js';

// ALA use this, but we do not have an index for it yet
// export { default as event } from '../shared/resources/event/index.ts';

// external data sources
export { orcid, person, viaf } from '../shared/resources/external/index.js';

// scalar types
export { default as scalars } from '../shared/scalars/index.js';
