const assert = require('assert');
const test = require('node:test');
const { reduce: reduceEventOccurrence } = require('../eventOccurrence/reduce');
const { reduce: reduceOccurrence } = require('../occurrence/reduce');
const { config: eventOccurrenceConfig } = require('../eventOccurrence/eventOccurrence.config');
const { config: occurrenceConfig } = require('../occurrence/occurrence.config');
const { config: eventConfig } = require('../event/event.config');
const { predicate2esQuery } = require('../../requestAdapter/query');
const { metric2aggs, get2metric } = require('../../requestAdapter/aggregations');
const { queryReducer } = require('../../responseAdapter');
const { aggsUseLeafTaxon, leafTaxonRuntimeMappings } = require('./taxonomy');

const taxonomy = [
  { name: 'Animalia', taxonKey: 'kingdom-1' },
  { name: 'Chordata', taxonKey: 'phylum-1' },
  { name: 'Latropiscis purpurissatus', taxonKey: 'species-1' },
];

function eventOccurrenceHit() {
  return {
    _source: {
      metadata: { datasetKey: 'dr1', datasetTitle: 'Survey' },
      verbatim: {
        core: {
          'http://rs.tdwg.org/dwc/terms/scientificName': 'Latropiscis purpurissatus',
        },
        extensions: {},
      },
      occurrence: {
        id: 'occ-1',
        taxonomy,
        issues: [],
      },
    },
  };
}

test('event occurrence reduce uses the leaf taxon and does not read gbifClassification', () => {
  const doc = reduceEventOccurrence(eventOccurrenceHit());
  assert.strictEqual(doc.scientificName, 'Latropiscis purpurissatus');
  assert.strictEqual(doc.acceptedScientificName, 'Latropiscis purpurissatus');
  assert.strictEqual(doc.taxonKey, 'species-1');
  assert.strictEqual(doc.acceptedTaxonKey, 'species-1');
  assert.strictEqual(doc.verbatimScientificName, 'Latropiscis purpurissatus');
  assert.strictEqual(doc.kingdom, null);
  assert.strictEqual(doc.gbifClassification.usage.formattedName, 'Latropiscis purpurissatus');
  assert.deepStrictEqual(
    doc.gbifClassification.classification.map((rank) => rank.name),
    ['Animalia', 'Chordata', 'Latropiscis purpurissatus'],
  );
});

test('reduce does not throw when taxonomy is missing', () => {
  const doc = reduceEventOccurrence({
    _source: {
      metadata: { datasetKey: 'dr1' },
      verbatim: { core: {} },
      occurrence: { id: 'occ-3', issues: [] },
    },
  });
  assert.strictEqual(doc.scientificName, null);
  assert.deepStrictEqual(doc.gbifClassification.classification, []);
});

test('occurrence reduce uses taxonomy when gbifClassification is absent', () => {
  const doc = reduceOccurrence({
    _source: {
      gbifId: 'occ-2',
      taxonomy,
      verbatim: { core: {}, extensions: {} },
      issues: [],
    },
  });
  assert.strictEqual(doc.scientificName, 'Latropiscis purpurissatus');
  assert.strictEqual(doc.taxonKey, 'species-1');
  assert.strictEqual(doc.gbifClassification.acceptedUsage.key, 'species-1');
});

test('taxonKey filter is a nested query on taxonomy.taxonKey', () => {
  const query = predicate2esQuery(
    { type: 'equals', key: 'taxonKey', value: 'species-1' },
    eventOccurrenceConfig,
  );
  assert.strictEqual(query.nested.path, 'occurrence.taxonomy');
  assert.deepStrictEqual(query.nested.query.bool.must[0], {
    term: { 'occurrence.taxonomy.taxonKey': 'species-1' },
  });

  const occurrenceQuery = predicate2esQuery(
    { type: 'equals', key: 'kingdomKey', value: 'kingdom-1' },
    occurrenceConfig,
  );
  assert.strictEqual(occurrenceQuery.nested.path, 'taxonomy');
  assert.deepStrictEqual(occurrenceQuery.nested.query.bool.must[0], {
    term: { 'taxonomy.taxonKey': 'kingdom-1' },
  });
});

test('species cardinality counts the leaf runtime field and lineage facets are nested', () => {
  const aggs = metric2aggs(
    {
      cardinality_species: { type: 'cardinality', key: 'species' },
      gbifClassification_acceptedUsage_key_facet: {
        type: 'facet',
        key: 'gbifClassification_acceptedUsage_key',
        size: 10000,
      },
    },
    eventOccurrenceConfig,
  );
  assert.strictEqual(aggs.cardinality_species.cardinality.field, 'leafTaxonKey');
  assert.strictEqual(
    aggs.gbifClassification_acceptedUsage_key_facet.nested.path,
    'occurrence.taxonomy',
  );
  assert.strictEqual(
    aggs.gbifClassification_acceptedUsage_key_facet.aggs
      .gbifClassification_acceptedUsage_key_facet.terms.field,
    'occurrence.taxonomy.taxonKey',
  );
  assert.strictEqual(aggsUseLeafTaxon(aggs), true);
  assert.match(leafTaxonRuntimeMappings().leafTaxonKey.script.source, /occ\.taxonomy/);

  const reduced = queryReducer({
    body: {
      hits: { total: { value: 1 }, hits: [] },
      aggregations: {
        gbifClassification_acceptedUsage_key_facet: {
          doc_count: 3,
          gbifClassification_acceptedUsage_key_facet: {
            buckets: [{ key: 'species-1', doc_count: 2 }],
          },
        },
      },
    },
    size: 0,
    from: 0,
    metrics: {
      gbifClassification_acceptedUsage_key_facet: {
        type: 'facet',
        key: 'gbifClassification_acceptedUsage_key',
      },
    },
  });
  assert.deepStrictEqual(reduced.aggregations.gbifClassification_acceptedUsage_key_facet.buckets, [
    { key: 'species-1', doc_count: 2 },
  ]);
});

test('event taxon facet unwraps the child join and the nested agg', () => {
  const aggs = metric2aggs(
    { taxonKey_facet: { type: 'facet', key: 'taxonKey', size: 5 } },
    eventConfig,
  );
  assert.strictEqual(aggs.taxonKey_facet.children.type, 'occurrence');
  assert.strictEqual(
    aggs.taxonKey_facet.aggs.taxonKey_facet.nested.path,
    'occurrence.taxonomy',
  );

  const reduced = queryReducer({
    body: {
      hits: { total: { value: 1 }, hits: [] },
      aggregations: {
        taxonKey_facet: {
          doc_count: 4,
          taxonKey_facet: {
            doc_count: 4,
            taxonKey_facet: {
              buckets: [{ key: 'species-1', doc_count: 2 }],
            },
          },
        },
      },
    },
    size: 0,
    from: 0,
    metrics: {
      taxonKey_facet: { type: 'facet', key: 'taxonKey' },
    },
  });
  assert.deepStrictEqual(reduced.aggregations.taxonKey_facet.buckets, [
    { key: 'species-1', doc_count: 2 },
  ]);
});

test('distinct taxa facet size is kept for the accepted usage key', () => {
  const metrics = get2metric(
    {
      eventID: 'event-1',
      facet: 'gbifClassification_acceptedUsage_key',
      'facet.size.gbifClassification_acceptedUsage_key': 10000,
      size: 0,
    },
    eventOccurrenceConfig,
  );
  assert.strictEqual(metrics.gbifClassification_acceptedUsage_key_facet.size, 10000);
  assert.strictEqual(metrics.gbifClassification_acceptedUsage_key_facet.type, 'facet');
});

test('a species filter queries the leaf runtime field', () => {
  const query = predicate2esQuery(
    { type: 'equals', key: 'species', value: 'species-1' },
    eventOccurrenceConfig,
  );
  assert.deepStrictEqual(query, { term: { leafTaxonKey: 'species-1' } });
  assert.strictEqual(aggsUseLeafTaxon(query), true);
});

test('event taxon key filter joins the occurrence child and queries nested taxonomy', () => {
  const query = predicate2esQuery(
    { type: 'equals', key: 'taxonKey', value: 'species-1' },
    eventConfig,
  );
  assert.strictEqual(query.has_child.type, 'occurrence');
  assert.strictEqual(query.has_child.query.nested.path, 'occurrence.taxonomy');
  assert.deepStrictEqual(query.has_child.query.nested.query.bool.must[0], {
    term: { 'occurrence.taxonomy.taxonKey': 'species-1' },
  });
});
