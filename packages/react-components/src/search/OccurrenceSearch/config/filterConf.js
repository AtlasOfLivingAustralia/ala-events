export const filters = [
  'taxonKey',
  'country',
  'publishingCountryCode',
  'datasetKey',
  'publisherKey',
  'institutionCode',
  'catalogNumber',
  'hostingOrganizationKey',
  'networkKey',
  'year',
  'basisOfRecord',
  'typeStatus',
  'occurrenceIssue',
  'mediaType',
  'sampleSizeUnit',
  'license',
  'projectId',
  'coordinateUncertainty',
  'depth',
  'organismQuantity',
  'sampleSizeValue',
  'relativeOrganismQuantity',
  'month',
  'continent',
  'protocol',
  'establishmentMeans',
  'recordedBy',
  'recordNumber',
  'collectionCode',
  'recordedById',
  'identifiedById',
  'occurrenceId',
  'organismId',
  'locality',
  'waterBody',
  'stateProvince',
  'eventId',
  'samplingProtocol',
  'elevation',
  'occurrenceStatus',
  'gadmGid',
  'identifiedBy',
  'isInCluster',
  'hasCoordinate',
  'hasGeospatialIssue',
  'institutionKey',
  'collectionKey',
  'q',
  'iucnRedListCategory',
  'verbatimScientificName',
  'dwcaExtension',
  'geometry'
].sort();

const highlighted = [
  'occurrenceStatus',
  'taxonKey',
  'year',
  'country',
  'occurrenceIssue'
];

export default { filters, included: filters, highlighted };