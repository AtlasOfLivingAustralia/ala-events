/* eslint-disable camelcase */
function requestMetric(
  searchApi,
  { predicate, name, metric, includeMeta = false },
) {
  if (typeof searchApi.enqueueMetric === 'function') {
    return searchApi.enqueueMetric({
      predicate,
      name,
      metric,
      includeMeta,
    });
  }
  return searchApi({
    query: {
      predicate,
      size: 0,
      metrics: {
        [name]: metric,
      },
    },
    includeMeta,
  }).then((data) => ({
    aggregation: data.aggregations[name],
    meta: data.meta,
  }));
}

/**
 * Convinent wrapper to generate the facet resolvers.
 * Given a string (facet name) then generate a query and map the result
 * @param {String} field
 */
const getFacet =
  (field, getSearchFunction) =>
  (parent, { size = 10, from = 0, include }, { dataSources }) => {
    const searchApi = getSearchFunction(dataSources);
    return requestMetric(searchApi, {
      predicate: parent._predicate,
      name: `facet_${field}`,
      includeMeta: true,
      metric: {
        type: 'facet',
        key: field,
        size,
        from,
        include,
      },
    }).then((data) => {
      return data.aggregation.buckets.map((bucket) => {
        const predicate = {
          type: 'equals',
          key: field,
          value: bucket.key,
        };
        const joinedPredicate = data.meta.predicate
          ? {
              type: 'and',
              predicates: [data.meta.predicate, predicate],
            }
          : predicate;
        return {
          key: bucket.key,
          count: bucket.doc_count,
          // create a new predicate that joins the base with the facet. This enables us to dig deeper for multidimensional metrics
          _predicate: joinedPredicate,
          _parentPredicate: data.meta.predicate,
        };
      });
    });
  };

/**
 * Convinent wrapper to generate the stat resolvers.
 * Given a string (field name) then generate a query and map the result
 * @param {String} field
 */
const getStats =
  (field, getSearchFunction) =>
  (parent, args, { dataSources }) => {
    const searchApi = getSearchFunction(dataSources);
    return requestMetric(searchApi, {
      predicate: parent._predicate,
      name: `stats_${field}`,
      metric: {
        type: 'stats',
        key: field,
      },
    }).then((data) => data.aggregation);
  };

/**
 * Convinent wrapper to generate the stat resolvers.
 * Given a string (field name) then generate a query and map the result
 * @param {String} field
 */
const getCardinality =
  (field, getSearchFunction) =>
  (parent, { precision_threshold = 10000 }, { dataSources }) => {
    const searchApi = getSearchFunction(dataSources);
    return requestMetric(searchApi, {
      predicate: parent._predicate,
      name: `cardinality_${field}`,
      metric: {
        type: 'cardinality',
        key: field,
        precision_threshold,
      },
    })
      .then((data) => data.aggregation.value)
      .catch((err) => {
        console.log(err);
        debugger;
      });
  };

/**
 * Convinent wrapper to generate the histogram resolvers.
 * Given a string (field name) then generate a query and map the result
 * @param {String} field
 */
const getHistogram =
  (field, getSearchFunction) =>
  (parent, { interval = 45 }, { dataSources }) => {
    // get SearchAPI
    const searchApi = getSearchFunction(dataSources);
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      size: 0,
      metrics: {
        histogram: {
          type: 'histogram',
          key: field,
          interval,
        },
      },
    };
    // query the API, and throw away anything but the facet counts
    return searchApi({ query }).then((data) => ({
      interval,
      ...data.aggregations.histogram,
    }));
  };

/**
 * Convinent wrapper to generate the histogram resolvers.
 * Given a string (field name) then generate a query and map the result
 * @param {String} field
 */
const getAutoDateHistogram =
  (field, getSearchFunction) =>
  (parent, { buckets = 10, minimum_interval }, { dataSources }) => {
    // get SearchAPI
    const searchApi = getSearchFunction(dataSources);
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      size: 0,
      metrics: {
        autoDateHistogram: {
          type: 'auto_date_histogram',
          minimum_interval,
          key: field,
          buckets,
        },
      },
    };
    // query the API, and throw away anything but the facet counts
    return searchApi({ query }).then((data) => ({
      bucketSize: buckets,
      ...data.aggregations.autoDateHistogram,
      buckets: data.aggregations.autoDateHistogram.buckets.map((x) => ({
        ...x,
        date: x.key_as_string,
        count: x.doc_count,
      })),
    }));
  };

export {
  getFacet,
  getStats,
  getCardinality,
  getHistogram,
  getAutoDateHistogram,
};
