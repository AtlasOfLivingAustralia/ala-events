function nearestFacetAncestor(key, parentKeyOf, counts) {
  const seen = new Set();
  let current = key;
  while (current && !seen.has(current)) {
    seen.add(current);
    const parent = parentKeyOf(current);
    if (parent == null || parent === '') return null;
    const parentId = String(parent);
    if (counts.has(parentId)) return parentId;
    current = parentId;
  }
  return null;
}

export async function exclusiveTaxaFromBuckets(buckets, getTaxon) {
  const cache = new Map();
  async function load(key) {
    const id = String(key);
    if (cache.has(id)) return cache.get(id);
    let taxon = null;
    try {
      taxon = await getTaxon(id);
    } catch (err) {
      taxon = null;
    }
    cache.set(id, taxon);
    return taxon;
  }

  const facetKeys = new Set(buckets.map((bucket) => String(bucket.key)));
  for (const key of facetKeys) {
    const seen = new Set();
    let current = key;
    while (current && !seen.has(current)) {
      seen.add(current);
      const taxon = await load(current);
      const parent = taxon?.parentKey;
      if (parent == null || parent === '') break;
      const parentId = String(parent);
      if (facetKeys.has(parentId)) break;
      current = parentId;
    }
  }

  return exclusiveTaxonCounts(buckets, (key) => cache.get(String(key))?.parentKey ?? null).map(
    ({ key, count }) => ({
      ...(cache.get(key) || {}),
      key,
      count,
    }),
  );
}

export function exclusiveTaxonCounts(buckets, parentKeyOf) {
  const counts = new Map(
    buckets.map((bucket) => [String(bucket.key), bucket.doc_count]),
  );
  const childSum = new Map();
  for (const key of counts.keys()) {
    const ancestor = nearestFacetAncestor(key, parentKeyOf, counts);
    if (!ancestor) continue;
    childSum.set(ancestor, (childSum.get(ancestor) || 0) + counts.get(key));
  }
  return [...counts.entries()]
    .map(([key, count]) => ({
      key,
      count: count - (childSum.get(key) || 0),
    }))
    .filter((row) => row.count > 0);
}
