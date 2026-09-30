import GbifRESTDataSource from '../../../datasources/GbifRESTDataSource.js';
import { stringify } from 'qs';

class NodeAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiv1;
  }

  async searchNodes({ query }) {
    return this.get('/node', {
      params: stringify(query, { indices: false }),
    });
  }

  async getNodeByKey({ key }) {
    return this.get(`/node/${key}`);
  }

  async getEndorsedOrganizations({ key, query }) {
    return this.get(`/node/${key}/organization`, {
      params: stringify(query, { indices: false }),
    });
  }

  async getOrganizationsPendingEndorsement({ key, query }) {
    return this.get(`/node/${key}/pendingEndorsement`, {
      params: stringify(query, { indices: false }),
    });
  }

  async getDatasets({ key, query }) {
    return this.get(`/node/${key}/dataset`, {
      params: stringify(query, { indices: false }),
    });
  }

  async getInstallations({ key, query }) {
    return this.get(`/node/${key}/installation`, {
      params: stringify(query, { indices: false }),
    });
  }
}

export default NodeAPI;
