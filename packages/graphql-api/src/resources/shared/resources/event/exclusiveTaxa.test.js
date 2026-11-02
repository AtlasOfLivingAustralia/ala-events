/* eslint-env mocha */
import assert from 'assert';
import {
  exclusiveTaxaFromBuckets,
  exclusiveTaxonCounts,
} from './exclusiveTaxa.js';

const parents = {
  s: 'g',
  g: 'k',
  k: null,
  s2: 'missing-genus',
  'missing-genus': 'k',
};

describe('exclusiveTaxonCounts', () => {
  it('drops parent ranks and keeps genus-only identifications', () => {
    const rows = exclusiveTaxonCounts(
      [
        { key: 'k', doc_count: 8 },
        { key: 'g', doc_count: 8 },
        { key: 's', doc_count: 5 },
      ],
      (key) => parents[key],
    );
    assert.deepStrictEqual(rows, [
      { key: 'g', count: 3 },
      { key: 's', count: 5 },
    ]);
  });

  it('walks past a rank that is missing from the facet', () => {
    const rows = exclusiveTaxonCounts(
      [
        { key: 'k', doc_count: 10 },
        { key: 's2', doc_count: 10 },
      ],
      (key) => parents[key],
    );
    assert.deepStrictEqual(rows, [{ key: 's2', count: 10 }]);
  });

  it('loads missing parents and keeps the identified taxon', async () => {
    const taxa = {
      s2: { key: 's2', parentKey: 'missing-genus', scientificName: 'Species two', kingdom: 'Animalia' },
      'missing-genus': { key: 'missing-genus', parentKey: 'k' },
      k: { key: 'k', parentKey: null, scientificName: 'Animalia' },
    };
    const rows = await exclusiveTaxaFromBuckets(
      [
        { key: 'k', doc_count: 10 },
        { key: 's2', doc_count: 10 },
      ],
      async (key) => {
        if (!taxa[key]) throw new Error('missing');
        return taxa[key];
      },
    );
    assert.deepStrictEqual(rows, [
      {
        key: 's2',
        parentKey: 'missing-genus',
        scientificName: 'Species two',
        kingdom: 'Animalia',
        count: 10,
      },
    ]);
  });
});
