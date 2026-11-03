const LOOKUP_CONCURRENCY = 8;

async function mapPool(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await fn(items[index]);
    }
  }
  const workers = Math.min(limit, items.length);
  await Promise.all(Array.from({ length: workers }, worker));
  return results;
}

// Leaf buckets are one key per identification. Names come from BIE; a lookup
// failure rejects so a missing parent is not reported as its own taxon.
export async function taxaFromLeafBuckets(buckets, getTaxon) {
  const cache = new Map();
  function load(key) {
    const id = String(key);
    if (!cache.has(id)) cache.set(id, Promise.resolve().then(() => getTaxon(id)));
    return cache.get(id);
  }

  return mapPool(buckets, LOOKUP_CONCURRENCY, async (bucket) => {
    const taxon = await load(bucket.key);
    return {
      ...(taxon || {}),
      key: String(bucket.key),
      count: bucket.doc_count,
    };
  });
}
