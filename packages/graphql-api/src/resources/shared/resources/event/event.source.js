import lodash from 'lodash';
import { LRUCache } from 'lru-cache';
import { Parser } from 'xml2js';
import GbifRESTDataSource from '../../../../datasources/GbifRESTDataSource.js';
import {
  createMetricBatcher,
  stableStringify,
} from '../../../../helpers/batchMetricSearch.js';

const { get } = lodash;

const urlSizeLimit = 2000; // use GET for requests that serialized is less than N characters
const emlParser = new Parser();
// EventAPI is constructed per request, so queryIds live here and are reused across requests.
const queryIdCache = new LRUCache({
  max: 1000,
  ttl: 10 * 60 * 1000,
});

class EventAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiEs;
    this.enqueueMetric = createMetricBatcher((batch) => {
      const query = {
        predicate: batch.predicate,
        size: 0,
        metrics: batch.metrics,
      };
      if (batch.endpoint === 'event-occurrence') {
        return this.searchOccurrences({
          query,
          includeMeta: batch.includeMeta,
        });
      }
      return this.searchEvents({ query, includeMeta: batch.includeMeta });
    });
  }

  willSendRequest(path, request) {
    // now that we make a public version, we might as well just make it open since the key is shared with everyone
    request.headers.Authorization = `ApiKey-v1 ${this.config.apiEsKey}`;
    super.willSendRequest(path, request);
  }

  async searchEventDocuments({ query }) {
    const response = await this.searchEvents({ query });
    return response.documents;
  }

  async searchOccurrenceDocuments({ query }) {
    const response = await this.searchOccurrences({ query });
    return response.documents;
  }

  async searchEventOccurrences({
    eventID,
    datasetKey,
    locationID,
    month,
    year,
    size,
    from,
  }) {
    const response = await this.eventOccurrences({
      eventID,
      datasetKey,
      locationID,
      month,
      year,
      size,
      from,
    });
    let results = response.documents.results.map((doc) => {
      return {
        key: doc.key,
        scientificName: doc.acceptedScientificName,
        kingdom: doc.kingdom,
        family: doc.family,
        individualCount: doc.individualCount,
        occurrenceStatus: doc.occurrenceStatus,
        basisOfRecord: doc.basisOfRecord,
      };
    });
    return {
      total: response.documents.total,
      size: response.documents.size,
      from: response.documents.from,
      results,
    };
  }

  async getArchive(datasetKey) {
    try {
      const response = await this.get(
        this.config.apiDownloads.replace('{datasetKey}', datasetKey),
        { signal: this.context.abortController.signal },
      );
      // map to support APIv1 naming
      return response;
    } catch (err) {
      return {
        url: null,
        fileSizeInMB: null,
        modified: null,
      };
    }
  }

  searchEvents = async ({ query, includeMeta = false }) => {
    const body = includeMeta ? { ...query, includeMeta: true } : { ...query };
    const serializedBody = JSON.stringify(body);
    let response;
    if (serializedBody.length < urlSizeLimit) {
      response = await this.get('/event', {
        params: { body: serializedBody },
        signal: this.context.abortController.signal,
      });
    } else {
      response = await this.post('/event', {
        body,
        signal: this.context.abortController.signal,
      });
    }
    // map to support APIv1 naming
    response.documents.count = response.documents.total;
    response.documents.limit = response.documents.size;
    response.documents.offset = response.documents.from;
    response._predicate = body.predicate;
    return response;
  };

  eventOccurrences = async ({
    eventID,
    datasetKey,
    locationID,
    month,
    year,
    size,
    from,
  }) => {
    const params = {
      size,
      from,
      ...(eventID && { eventHierarchy: eventID }),
      ...(datasetKey && { datasetKey }),
      ...(locationID && { locationID }),
      ...(month && { month }),
      ...(year && { year }),
    };

    let response = await this.get('/event-occurrence', {
      params,
      signal: this.context.abortController.signal,
    });

    // map to support APIv1 naming
    response.documents.count = response.documents.total;
    response.documents.limit = response.documents.size;
    response.documents.offset = response.documents.from;
    return response;
  };

  searchOccurrences = async ({ query, includeMeta = false }) => {
    const body = includeMeta ? { ...query, includeMeta: true } : { ...query };
    const serializedBody = JSON.stringify(body);
    let response;
    if (serializedBody.length < urlSizeLimit) {
      response = await this.get('/event-occurrence', {
        params: { body: serializedBody },
        signal: this.context.abortController.signal,
      });
    } else {
      response = await this.post('/event-occurrence', {
        body,
        signal: this.context.abortController.signal,
      });
    }
    // map to support APIv1 naming
    response.documents.count = response.documents.total;
    response.documents.limit = response.documents.size;
    response.documents.offset = response.documents.from;
    response._predicate = body.predicate;
    return response;
  };

  async getEventByKey({ eventID, datasetKey }) {
    return this.get(`/event/key/${datasetKey}/${encodeURIComponent(eventID)}`);
  }

  async getDatasetEML({ datasetKey }) {
    const url = this.config.datasetEml.replace('{datasetKey}', datasetKey);
    const xml = await this.get(url);
    const datasetJson = await emlParser.parseStringPromise(xml);
    const dataset = get(datasetJson, "['eml:eml'].dataset[0]");
    const additionalMetadata = get(
      datasetJson,
      "['eml:eml'].additionalMetadata[0]",
    );
    const datasetCurated = {
      key: datasetKey,
      title: get(dataset, 'title[0]._'),
      abstract: get(dataset, 'abstract[0].para[0]'),
      purpose: get(dataset, 'purpose[0].para[0]'),
      intellectualRights: get(dataset, 'intellectualRights[0].para[0]'),
      methods: get(dataset, 'methods'),
      contact: get(dataset, 'contact'),
      citation: get(additionalMetadata, 'metadata[0].gbif[0].citation'),
      rights: get(additionalMetadata, 'metadata[0].gbif[0].rights'),
    };

    // return datasetCurrated;
    return {
      value: datasetCurated,
      raw: datasetJson,
    };
  }

  async getLocation({ locationID }) {
    const query = JSON.stringify({ locationID });
    const response = await this.get('/event', {
      params: { body: query },
      signal: this.context.abortController.signal,
    });
    return response.documents.results[0];
  }

  async meta({ query }) {
    const body = { ...query };
    const response = await this.post('/event/meta', { body });
    return response;
  }

  async registerPredicate({ predicate }) {
    const cacheKey = stableStringify(predicate);
    const cached = queryIdCache.get(cacheKey);
    if (cached) return cached;

    const pending = this.loadTileQueryId(predicate);
    queryIdCache.set(cacheKey, pending);
    const queryId = await pending;
    if (typeof queryId === 'string') {
      queryIdCache.set(cacheKey, queryId);
    } else {
      queryIdCache.delete(cacheKey);
    }
    return queryId;
  }

  async loadTileQueryId(predicate) {
    try {
      const metaResponse = await this.meta({ query: { predicate } });
      const { query } = metaResponse;
      const response = await this.post(`${this.config.es2vt}/register`, {
        body: { query: { query, grid_type: 'centroid' } },
        signal: this.context.abortController.signal,
      });
      return response.queryId;
    } catch (err) {
      console.log(err);
      return {
        err: {
          error: 'FAILED_TO_REGISTER_PREDICATE',
        },
        predicate: null,
      };
    }
  }
}

export default EventAPI;
