const { LRUCache } = require('lru-cache');

// Successful tile bodies, keyed by queryId:z:x:y. TTL matches the Cache-Control
// max-age on 200 responses. maxSize bounds payload bytes; max bounds entry count
// so tiny tiles cannot grow the LRU bookkeeping without limit.
const TILE_CACHE_MAX_AGE_SECONDS = 60;
const TILE_TTL_MS = TILE_CACHE_MAX_AGE_SECONDS * 1000;
const TILE_CACHE_MAX_BYTES = 64 * 1024 * 1024;
const TILE_CACHE_MAX_ENTRIES = 10000;

function createTileCache({
  ttl = TILE_TTL_MS,
  maxBytes = TILE_CACHE_MAX_BYTES,
  maxEntries = TILE_CACHE_MAX_ENTRIES
} = {}) {
  const cache = new LRUCache({
    max: maxEntries,
    maxSize: maxBytes,
    ttl,
    sizeCalculation: (value) => Math.max(value.length, 1)
  });
  const inflight = new Map();

  function getCachedTile(key, load) {
    const cached = cache.get(key);
    if (cached !== undefined) return Promise.resolve(cached);

    const pending = inflight.get(key);
    if (pending) return pending;

    const promise = Promise.resolve()
      .then(load)
      .then((body) => {
        // Failures reject above and are not stored. A tile larger than the byte
        // cap is still returned; set() would refuse it and must not fail the response.
        if (Buffer.isBuffer(body) && body.length <= maxBytes) {
          cache.set(key, body);
        }
        return body;
      })
      .finally(() => {
        inflight.delete(key);
      });

    inflight.set(key, promise);
    return promise;
  }

  return { getCachedTile, cache };
}

const tileCache = createTileCache();

function tileCacheKey(queryId, z, x, y) {
  return `${queryId}:${z}:${x}:${y}`;
}

// Reuse a Buffer body as-is. Buffer.from(..., 'binary') copies, and is only
// for string bodies from the Elasticsearch client.
function tileResponseBody(body) {
  if (Buffer.isBuffer(body)) return body;
  return Buffer.from(body, 'binary');
}

module.exports = {
  TILE_CACHE_MAX_AGE_SECONDS,
  TILE_CACHE_MAX_BYTES,
  TILE_CACHE_MAX_ENTRIES,
  TILE_TTL_MS,
  createTileCache,
  getCachedTile: tileCache.getCachedTile,
  tileCacheKey,
  tileResponseBody
};
