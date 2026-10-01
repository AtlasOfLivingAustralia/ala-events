/* eslint-env mocha */
import assert from 'assert';
import { createMetricBatcher, stableStringify } from './batchMetricSearch.js';

const predicate = { type: 'equals', key: 'country', value: 'AU' };

function enqueuePair(enqueue, endpoint) {
  return Promise.all([
    enqueue({
      endpoint,
      predicate,
      name: 'facet_year',
      includeMeta: true,
      metric: { type: 'facet', key: 'year', size: 10 },
    }),
    enqueue({
      endpoint,
      predicate: { value: 'AU', key: 'country', type: 'equals' },
      name: 'stats_year',
      metric: { type: 'stats', key: 'year' },
    }),
  ]);
}

describe('batchMetricSearch', () => {
  it('stringifies objects with stable key order', () => {
    assert.strictEqual(
      stableStringify({ b: 1, a: { d: 2, c: 3 } }),
      stableStringify({ a: { c: 3, d: 2 }, b: 1 }),
    );
  });

  it('coalesces same endpoint and predicate into one search', async () => {
    const calls = [];
    const enqueue = createMetricBatcher((batch) => {
      calls.push({
        endpoint: batch.endpoint,
        includeMeta: batch.includeMeta,
        names: Object.keys(batch.metrics),
      });
      return {
        aggregations: {
          facet_year: { buckets: [{ key: '2020', doc_count: 2 }] },
          stats_year: { min: 1990 },
          facet_species: { buckets: [] },
        },
        meta: { predicate: { type: 'and', predicates: [] } },
      };
    });

    const occurrence = enqueue({
      endpoint: 'event-occurrence',
      predicate,
      name: 'facet_species',
      includeMeta: true,
      metric: { type: 'facet', key: 'species' },
    });
    const [facet, stats] = await enqueuePair(enqueue, 'event');
    await occurrence;

    assert.strictEqual(calls.length, 2);
    const eventCall = calls.find((call) => call.endpoint === 'event');
    const occurrenceCall = calls.find(
      (call) => call.endpoint === 'event-occurrence',
    );
    assert.deepStrictEqual(eventCall.names.sort(), [
      'facet_year',
      'stats_year',
    ]);
    assert.strictEqual(eventCall.includeMeta, true);
    assert.deepStrictEqual(occurrenceCall.names, ['facet_species']);
    assert.strictEqual(facet.aggregation.buckets[0].doc_count, 2);
    assert.strictEqual(facet.meta.predicate.type, 'and');
    assert.strictEqual(stats.aggregation.min, 1990);
    assert.strictEqual(stats.meta.predicate.type, 'and');
  });

  it('keeps different predicates on separate searches', async () => {
    const calls = [];
    const enqueue = createMetricBatcher((batch) => {
      calls.push(batch.predicate);
      return { aggregations: { facet_year: { buckets: [] } }, meta: {} };
    });

    await Promise.all([
      enqueue({
        endpoint: 'event',
        predicate,
        name: 'facet_year',
        includeMeta: true,
        metric: { type: 'facet', key: 'year' },
      }),
      enqueue({
        endpoint: 'event',
        predicate: { type: 'equals', key: 'country', value: 'NZ' },
        name: 'facet_year',
        includeMeta: true,
        metric: { type: 'facet', key: 'year' },
      }),
    ]);

    assert.strictEqual(calls.length, 2);
  });

  it('rejects every waiter when the search fails', async () => {
    const enqueue = createMetricBatcher(() =>
      Promise.reject(new Error('boom')),
    );
    const pending = [
      enqueue({
        endpoint: 'event',
        predicate,
        name: 'facet_year',
        metric: { type: 'facet', key: 'year' },
      }),
      enqueue({
        endpoint: 'event',
        predicate,
        name: 'stats_year',
        metric: { type: 'stats', key: 'year' },
      }),
    ];
    const results = await Promise.allSettled(pending);
    assert.deepStrictEqual(
      results.map((result) => result.status),
      ['rejected', 'rejected'],
    );
    assert.strictEqual(results[0].reason.message, 'boom');
    assert.strictEqual(results[1].reason.message, 'boom');
  });
});
