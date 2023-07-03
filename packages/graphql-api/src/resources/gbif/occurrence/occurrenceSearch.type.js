import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    occurrenceSearch(
      apiKey: String
      predicate: Predicate
      size: Int
      from: Int
    ): OccurrenceSearchResult
    occurrence(key: ID!): Occurrence
    globe(
      cLat: Float
      cLon: Float
      pLat: Float
      pLon: Float
      sphere: Boolean
      graticule: Boolean
      land: Boolean
    ): Globe
  }

  type OccurrenceSearchResult {
    """
    The occurrences that match the filter
    """
    documents(size: Int, from: Int): OccurrenceDocuments!
    """
    Get number of occurrences per distinct values in a field. E.g. how many occurrences per year.
    """
    facet: OccurrenceFacet
    """
    Get statistics for a numeric field. Minimimum value, maximum etc.
    """
    stats: OccurrenceStats
    """
    Get number of distinct values for a field. E.g. how many distinct datasetKeys in this result set
    """
    cardinality: OccurrenceCardinality
    """
    Get histogram for a numeric field with the option to specify an interval size
    """
    histogram: OccurrenceHistogram
    autoDateHistogram: OccurrenceAutoDateHistogram
    _predicate: JSON
    _downloadPredicate: JSON
    """
    Register the search predicate with the v1 endpoints and get a hash back. This can be used to query e.g. the tile API.
    """
    _v1PredicateHash: String
    _meta: JSON
  }

  type OccurrenceDocuments {
    size: Int!
    from: Int!
    total: Long!
    results: [Occurrence]!
  }

  type OccurrenceStats {
    year: Stats!
    decimalLatitude: Stats!
    decimalLongitude: Stats!
    eventDate: Stats!
  }

  type OccurrenceCardinality {
    datasetKey: Int!
    publishingOrg: Int!
    recordedBy: Int!
    catalogNumber: Int!
    identifiedBy: Int!
    locality: Int!
    waterBody: Int!
    stateProvince: Int!
    samplingProtocol: Int!
    sampleSizeUnit: Int!
    verbatimScientificName: Int!
    eventId: Int!
    month: Int!
    license: Int!
    basisOfRecord: Int!
    issue: Int!
    collectionKey: Int!
    collectionCode: Int!
    taxonKey: Int!
    classKey: Int!
    familyKey: Int!
    genusKey: Int!
    kingdomKey: Int!
    orderKey: Int!
    phylumKey: Int!
    speciesKey: Int!
    preparations: Int!
  }

  type OccurrenceHistogram {
    decimalLongitude(interval: Float): LongitudeHistogram!
  }

  type OccurrenceAutoDateHistogram {
    eventDate(buckets: Float): JSON!
  }

  type LongitudeHistogram {
    buckets: JSON!
    bounds: JSON
  }

  type OccurrenceFacet {
    # datasetTitle(size: Int): [OccurrenceFacetResult_string]
    # publisherTitle(size: Int): [OccurrenceFacetResult_string]

    basisOfRecord(size: Int, from: Int): [OccurrenceFacetResult_string]
    catalogNumber(size: Int, from: Int): [OccurrenceFacetResult_string]
    collectionCode(size: Int, from: Int): [OccurrenceFacetResult_string]
    continent(size: Int, from: Int): [OccurrenceFacetResult_string]
    countryCode(size: Int, from: Int): [OccurrenceFacetResult_string]
    datasetPublishingCountry(size: Int, from: Int): [OccurrenceFacetResult_string]
    dwcaExtension(size: Int, from: Int): [OccurrenceFacetResult_string]
    establishmentMeans(size: Int, from: Int): [OccurrenceFacetResult_string]
    eventId(size: Int, from: Int): [OccurrenceFacetResult_string]
    id(size: Int, from: Int): [OccurrenceFacetResult_string]
    institutionCode(size: Int, from: Int): [OccurrenceFacetResult_string]
    issue(size: Int, from: Int): [OccurrenceFacetResult_string]
    license(size: Int, from: Int): [OccurrenceFacetResult_string]
    lifeStage(size: Int, from: Int): [OccurrenceFacetResult_string]
    locality(size: Int, from: Int): [OccurrenceFacetResult_string]
    mediaLicenses(size: Int, from: Int): [OccurrenceFacetResult_string]
    mediaTypes(size: Int, from: Int): [OccurrenceFacetResult_string]
    # notIssues(size: Int, from: Int): [OccurrenceFacetResult_string]
    occurrenceId(size: Int, from: Int): [OccurrenceFacetResult_string]
    organismId(size: Int, from: Int): [OccurrenceFacetResult_string]
    organismQuantityType(size: Int, from: Int): [OccurrenceFacetResult_string]
    parentEventId(size: Int, from: Int): [OccurrenceFacetResult_string]
    preparations(size: Int, from: Int): [OccurrenceFacetResult_string]
    programmeAcronym(size: Int, from: Int): [OccurrenceFacetResult_string]
    projectId(size: Int, from: Int): [OccurrenceFacetResult_string]
    protocol(size: Int, from: Int): [OccurrenceFacetResult_string]
    publishingCountry(size: Int, from: Int): [OccurrenceFacetResult_string]
    recordNumber(size: Int, from: Int): [OccurrenceFacetResult_string]
    sampleSizeUnit(size: Int, from: Int): [OccurrenceFacetResult_string]
    samplingProtocol(size: Int, from: Int): [OccurrenceFacetResult_string]
    sex(size: Int, from: Int): [OccurrenceFacetResult_string]
    stateProvince(size: Int, from: Int): [OccurrenceFacetResult_string]
    typeStatus(size: Int, from: Int): [OccurrenceFacetResult_string]
    typifiedName(size: Int, from: Int): [OccurrenceFacetResult_string]
    waterBody(size: Int, from: Int): [OccurrenceFacetResult_string]
    agentIds_type(size: Int, from: Int): [OccurrenceFacetResult_string]
    agentIds_value(size: Int, from: Int): [OccurrenceFacetResult_string]
    gbifClassification_classificationPath(size: Int, from: Int): [OccurrenceFacetResult_string]
    verbatimScientificName(size: Int, from: Int): [OccurrenceFacetResult_string]
    gbifClassification_acceptedUsage_rank(size: Int, from: Int): [OccurrenceFacetResult_string]
    gbifClassification_classification_rank(size: Int, from: Int): [OccurrenceFacetResult_string]
    gbifClassification_diagnostics_matchType(size: Int, from: Int): [OccurrenceFacetResult_string]
    gbifClassification_diagnostics_status(size: Int, from: Int): [OccurrenceFacetResult_string]
    gbifClassification_usage_name(size: Int, from: Int): [OccurrenceFacetResult_string]
    gbifClassification_usage_rank(size: Int, from: Int): [OccurrenceFacetResult_string]
    gbifClassification_usageParsedName_notho(size: Int, from: Int): [OccurrenceFacetResult_string]
    gbifClassification_usageParsedName_rank(size: Int, from: Int): [OccurrenceFacetResult_string]
    gbifClassification_usageParsedName_state(size: Int, from: Int): [OccurrenceFacetResult_string]
    gbifClassification_usageParsedName_type(size: Int, from: Int): [OccurrenceFacetResult_string]
    gbifClassification_usageParsedName_basionymAuthorship_year(size: Int, from: Int): [OccurrenceFacetResult_string]
    gbifClassification_usageParsedName_combinationAuthorship_year(size: Int, from: Int): [OccurrenceFacetResult_string]

    coordinatePrecision(size: Int, from: Int): [OccurrenceFacetResult_float]
    coordinateUncertaintyInMeters(size: Int, from: Int): [OccurrenceFacetResult_float]
    crawlId(size: Int, from: Int): [OccurrenceFacetResult_float]
    day(size: Int, from: Int): [OccurrenceFacetResult_float]
    decimalLatitude(size: Int, from: Int): [OccurrenceFacetResult_float]
    decimalLongitude(size: Int, from: Int): [OccurrenceFacetResult_float]
    depth(size: Int, from: Int): [OccurrenceFacetResult_float]
    depthAccuracy(size: Int, from: Int): [OccurrenceFacetResult_float]
    elevation(size: Int, from: Int): [OccurrenceFacetResult_float]
    elevationAccuracy(size: Int, from: Int): [OccurrenceFacetResult_float]
    endDayOfYear(size: Int, from: Int): [OccurrenceFacetResult_float]
    individualCount(size: Int, from: Int): [OccurrenceFacetResult_float]
    maximumDepthInMeters(size: Int, from: Int): [OccurrenceFacetResult_float]
    maximumDistanceAboveSurfaceInMeters(size: Int, from: Int): [OccurrenceFacetResult_float]
    maximumElevationInMeters(size: Int, from: Int): [OccurrenceFacetResult_float]
    minimumDepthInMeters(size: Int, from: Int): [OccurrenceFacetResult_float]
    minimumDistanceAboveSurfaceInMeters(size: Int, from: Int): [OccurrenceFacetResult_float]
    minimumElevationInMeters(size: Int, from: Int): [OccurrenceFacetResult_float]
    month(size: Int, from: Int): [OccurrenceFacetResult_float]
    organismQuantity(size: Int, from: Int): [OccurrenceFacetResult_float]
    relativeOrganismQuantity(size: Int, from: Int): [OccurrenceFacetResult_float]
    sampleSizeValue(size: Int, from: Int): [OccurrenceFacetResult_float]
    startDayOfYear(size: Int, from: Int): [OccurrenceFacetResult_float]
    year(size: Int, from: Int): [OccurrenceFacetResult_float]

    hasCoordinate(size: Int): [OccurrenceFacetResult_boolean]
    hasGeospatialIssue(size: Int): [OccurrenceFacetResult_boolean]
    repatriated(size: Int): [OccurrenceFacetResult_boolean]
    occurrenceStatus(size: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_synonym(size: Int, from: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_classification_synonym(size: Int, from: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_abbreviated(size: Int, from: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_autonym(size: Int, from: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_binomial(size: Int, from: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_candidatus(size: Int, from: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_doubtful(size: Int, from: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_incomplete(size: Int, from: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_indetermined(size: Int, from: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_trinomial(size: Int, from: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_basionymAuthorship_empty(size: Int, from: Int): [OccurrenceFacetResult_boolean]
    gbifClassification_usageParsedName_combinationAuthorship_empty(size: Int, from: Int): [OccurrenceFacetResult_boolean]

    datasetKey(size: Int, from: Int): [OccurrenceFacetResult_dataset]
    endorsingNodeKey(size: Int, from: Int): [OccurrenceFacetResult_node]
    installationKey(size: Int, from: Int): [OccurrenceFacetResult_installation]
    networkKey(size: Int, from: Int): [OccurrenceFacetResult_network]
    publishingOrg(size: Int, from: Int): [OccurrenceFacetResult_organization]

    gbifClassification_taxonID(size: Int, from: Int): [OccurrenceFacetResult_string]
    collectionKey(size: Int, from: Int): [OccurrenceFacetResult_collection]
    institutionKey(size: Int, from: Int): [OccurrenceFacetResult_institution]
    recordedBy(size: Int, from: Int, include: String): [OccurrenceFacetResult_recordedBy]
    identifiedBy(size: Int, from: Int, include: String): [OccurrenceFacetResult_identifiedBy]
    
    taxonKey(size: Int, from: Int):                              [OccurrenceFacetResult_taxon]
    classKey(size: Int, from: Int):                              [OccurrenceFacetResult_taxon]
    familyKey(size: Int, from: Int):                             [OccurrenceFacetResult_taxon]
    genusKey(size: Int, from: Int):                              [OccurrenceFacetResult_taxon]
    kingdomKey(size: Int, from: Int):                            [OccurrenceFacetResult_taxon]
    orderKey(size: Int, from: Int):                              [OccurrenceFacetResult_taxon]
    phylumKey(size: Int, from: Int):                             [OccurrenceFacetResult_taxon]
    speciesKey(size: Int, from: Int):                            [OccurrenceFacetResult_taxon]
    gbifClassification_acceptedUsage_key(size: Int, from: Int):  [OccurrenceFacetResult_taxon]
    gbifClassification_classification_key(size: Int, from: Int): [OccurrenceFacetResult_taxon]
    gbifClassification_usage_key(size: Int, from: Int):          [OccurrenceFacetResult_taxon]
  }

  type OccurrenceFacetResult_float {
    key: Float!
    count: Int!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_boolean {
    key: Boolean!
    count: Int!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_string {
    key: String!
    count: Int!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_dataset {
    key: String!
    count: Int!
    dataset: Dataset!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_node {
    key: String!
    count: Int!
    node: Node!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_installation {
    key: String!
    count: Int!
    installation: Node!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_taxon {
    key: String!
    count: Int!
    taxon: Taxon!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_network {
    key: String!
    count: Int!
    network: Network!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_organization {
    key: String!
    count: Int!
    publisher: Organization!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_institution {
    key: String!
    count: Int!
    institution: Institution!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_collection {
    key: String!
    count: Int!
    collection: Collection!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_recordedBy {
    key: String!
    count: Int!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    occurrencesIdentifiedBy(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type OccurrenceFacetResult_identifiedBy {
    key: String!
    count: Int!
    occurrences(size: Int, from: Int): OccurrenceSearchResult!
    occurrencesRecordedBy(size: Int, from: Int): OccurrenceSearchResult!
    _predicate: JSON
  }

  type Stats {
    count: Float!
    min: Float
    max: Float
    avg: Float
    sum: Float
  }
`;

export default typeDef;
