import { stringify } from 'qs';
import GbifRESTDataSource from '../../../datasources/GbifRESTDataSource.js';
import { createMetricBatcher } from '../../../helpers/batchMetricSearch.js';

const urlSizeLimit = 2000; // use GET for requests that serialized is less than N characters

class OccurrenceAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiEs;
    this.enqueueMetric = createMetricBatcher((batch) =>
      this.searchOccurrences({
        query: {
          predicate: batch.predicate,
          size: 0,
          metrics: batch.metrics,
        },
        includeMeta: batch.includeMeta,
      }),
    );
  }

  willSendRequest(path, request) {
    // now that we make a public version, we might as well just make it open since the key is shared with everyone
    request.headers.Authorization = `ApiKey-v1 ${this.config.apiEsKey}`;
    super.willSendRequest(path, request);
  }

  async searchOccurrenceDocuments({ query }) {
    const response = await this.searchOccurrences({ query });
    return response.documents;
  }

  async searchOccurrences({ query, includeMeta = false }) {
    const body = includeMeta ? { ...query, includeMeta: true } : { ...query };
    const serializedBody = JSON.stringify(body);
    let response;
    if (serializedBody.length < urlSizeLimit) {
      response = await this.get('/occurrence', {
        params: { body: serializedBody },
        signal: this.context.abortController.signal,
      });
    } else {
      response = await this.post('/occurrence', {
        body,
        signal: this.context.abortController.signal,
      });
    }
    response._predicate = body.predicate;
    return response;
  }

  async getOccurrenceByKey({ key }) {
    return this.get(`/occurrence/key/${key}`);
  }

  async getRelated({ key }) {
    return this.get(
      `${this.config.apiv1}/occurrence/${key}/experimental/related`,
    );
  }

  async getFragment({ key }) {
    return this.get(`${this.config.apiv1}/occurrence/${key}/fragment`);
  }

  async getVerbatim({ key }) {
    return this.get(`${this.config.apiv1}/occurrence/${key}/verbatim`);
  }

  async getBionomia({ occurrence }) {
    const { datasetKey, occurrenceID } = occurrence;
    return this.get(
      `https://bionomia.net/occurrences/search?datasetKey=${datasetKey}&occurrenceID=${occurrenceID}`,
    );
  }

  async meta({ query }) {
    const body = { ...query };
    const response = await this.post('/occurrence/meta', { body });
    return response;
  }

  async registerPredicate({ predicate }) {
    try {
      return await this.post(
        `${this.config.apiv2}/map/occurrence/adhoc/predicate/`,
        {
          body: predicate,
          signal: this.context.abortController.signal,
        },
      );
    } catch (err) {
      return {
        err: {
          error: 'FAILED_TO_REGISTER_PREDICATE',
        },
        predicate: null,
      };
    }
  }

  async getMapCapabilities(query) {
    return this.get(
      `${this.config.apiv2}/map/occurrence/density/capabilities.json?`,
      {
        params: stringify(query, { indices: false }),
      },
    );
  }

  async searchCollections({ query }) {
    return this.get('/grscicoll/collection', {
      params: stringify(query, { indices: false }),
    });
  }

  /*
  getOccurrencesByKeys({ occurrenceKeys }) {
    return Promise.all(
      occurrenceKeys.map(key => this.getOccurrenceByKey({ key })),
    );
  }
  */
}

export default OccurrenceAPI;
