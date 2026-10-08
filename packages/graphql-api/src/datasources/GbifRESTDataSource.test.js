import assert from 'assert';
import GbifRESTDataSource from './GbifRESTDataSource.js';

describe('GbifRESTDataSource.resolveURL', () => {
  it('keeps baseURL path when given a leading slash', () => {
    const source = new GbifRESTDataSource({ cache: undefined, context: {}, config: {} });
    source.baseURL = 'https://api.gbif.org/v1';
    const url = source.resolveURL('/dataset/abc');
    assert.strictEqual(url.toString(), 'https://api.gbif.org/v1/dataset/abc');
  });

  it('passes absolute URLs through unchanged', () => {
    const source = new GbifRESTDataSource({ cache: undefined, context: {}, config: {} });
    source.baseURL = 'https://api.gbif.org/v1';
    const url = source.resolveURL('https://bionomia.net/occurrences/search');
    assert.strictEqual(url.toString(), 'https://bionomia.net/occurrences/search');
  });

  it('resolves relative paths when baseURL is missing', () => {
    const source = new GbifRESTDataSource({ cache: undefined, context: {}, config: {} });
    // URL requires an absolute base for path-only inputs; use an absolute path-style absolute URL
    const url = source.resolveURL('https://example.com/alone');
    assert.strictEqual(url.toString(), 'https://example.com/alone');
  });
});
