import GbifRESTDataSource from '../../../datasources/GbifRESTDataSource.js';
import { stringify } from 'qs';

class InstallationAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiv1;
  }

  async searchInstallations({ query }) {
    return this.get('/installation', {
      params: stringify(query, { indices: false }),
    });
  }

  async getInstallationByKey({ key }) {
    return this.get(`/installation/${key}`);
  }

  async getDatasets({ key, query }) {
    return this.get(`/installation/${key}/dataset`, {
      params: stringify(query, { indices: false }),
    });
  }
}

export default InstallationAPI;
