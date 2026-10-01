/**
 * Coalesce size-0 metric searches that share an endpoint and predicate.
 * Resolvers enqueue during the current turn; one search runs on the next tick.
 */

export function stableStringify(value) {
  if (value === undefined) return 'undefined';
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(',')}}`;
}

function uniqueMetricName(metrics, name) {
  if (!Object.prototype.hasOwnProperty.call(metrics, name)) return name;
  let suffix = 2;
  let candidate = `${name}__${suffix}`;
  while (Object.prototype.hasOwnProperty.call(metrics, candidate)) {
    suffix += 1;
    candidate = `${name}__${suffix}`;
  }
  return candidate;
}

function settleWaiters(waiters, settle) {
  waiters.forEach((waiter) => {
    try {
      settle(waiter);
    } catch (err) {
      waiter.reject(err);
    }
  });
}

function flushMetricBatch(batch, runSearch) {
  let searchPromise;
  try {
    searchPromise = Promise.resolve(runSearch(batch));
  } catch (err) {
    searchPromise = Promise.reject(err);
  }

  searchPromise.then(
    (data) => {
      settleWaiters(batch.waiters, (waiter) => {
        waiter.resolve({
          aggregation: data.aggregations[waiter.metricName],
          meta: data.meta,
        });
      });
    },
    (err) => {
      settleWaiters(batch.waiters, (waiter) => {
        waiter.reject(err);
      });
    },
  );
}

export function createMetricBatcher(runSearch) {
  const batches = new Map();

  return function enqueueMetric({
    endpoint = '',
    predicate,
    name,
    metric,
    includeMeta = false,
  }) {
    const key = `${endpoint}\0${stableStringify(predicate)}`;
    let batch = batches.get(key);
    if (!batch) {
      batch = {
        endpoint,
        predicate,
        metrics: {},
        includeMeta: false,
        waiters: [],
      };
      batches.set(key, batch);
      process.nextTick(() => {
        if (batches.get(key) === batch) batches.delete(key);
        flushMetricBatch(batch, runSearch);
      });
    }
    if (includeMeta) batch.includeMeta = true;
    const metricName = uniqueMetricName(batch.metrics, name);
    batch.metrics[metricName] = metric;
    return new Promise((resolve, reject) => {
      batch.waiters.push({ metricName, resolve, reject });
    });
  };
}
