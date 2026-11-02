const _ = require('lodash');

function unwrapAgg(metricResult, metricKey) {
  let current = metricResult;
  const seen = new Set();
  while (
    current &&
    !seen.has(current) &&
    current.buckets == null &&
    current.value == null &&
    current[metricKey]
  ) {
    seen.add(current);
    current = current[metricKey];
  }
  return current;
}

function queryReducer({body, size, from, metrics = {}}) {
  if (!body.aggregations) body.aggregations = {};

  // Lift child, join, and nested aggs that reuse the metric name.
  Object.keys(metrics).forEach(metricKey => {
    const metricResult = body.aggregations[metricKey];
    if (!metricResult) return;
    body.aggregations[metricKey] = unwrapAgg(metricResult, metricKey);
  });

  // process facets for "fake" pagination
  Object.keys(metrics).forEach(metricKey => {
    let metric = metrics[metricKey];
    if (metric.type !== 'facet' && metric.type !== 'multifacet') return;
    if (!metric.from || metric.from < 1) return;
    let buckets = body.aggregations[metricKey]?.buckets;
    if (Array.isArray(buckets)) {
      body.aggregations[metricKey].buckets = body.aggregations[metricKey].buckets.slice(metric.from);
    }
  });
  
  return {
    documents: {
      size,
      from,
      total: _.get(body, 'hits.total.value'),
      results: _.get(body, 'hits.hits', [])
    },
    aggregations: _.get(body, 'aggregations'),
  };
}

module.exports = {
  queryReducer
}