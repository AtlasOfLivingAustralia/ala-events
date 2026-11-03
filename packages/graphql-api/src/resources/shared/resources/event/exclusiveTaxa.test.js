/* eslint-env mocha */
import assert from 'assert';
import { taxaFromLeafBuckets } from './exclusiveTaxa.js';

describe('taxaFromLeafBuckets', () => {
  it('keeps the leaf count and loads each taxon once', async () => {
    const calls = [];
    const rows = await taxaFromLeafBuckets(
      [
        { key: 'species-1', doc_count: 4 },
        { key: 'genus-1', doc_count: 2 },
        { key: 'species-1', doc_count: 1 },
      ],
      async (key) => {
        calls.push(key);
        return { key, scientificName: key, kingdom: 'Animalia' };
      },
    );
    assert.deepStrictEqual(calls, ['species-1', 'genus-1']);
    assert.deepStrictEqual(rows, [
      { key: 'species-1', scientificName: 'species-1', kingdom: 'Animalia', count: 4 },
      { key: 'genus-1', scientificName: 'genus-1', kingdom: 'Animalia', count: 2 },
      { key: 'species-1', scientificName: 'species-1', kingdom: 'Animalia', count: 1 },
    ]);
  });

  it('rejects when a taxon lookup fails', async () => {
    await assert.rejects(
      taxaFromLeafBuckets(
        [{ key: 'species-1', doc_count: 4 }],
        async () => {
          throw new Error('bie down');
        },
      ),
      /bie down/,
    );
  });
});
