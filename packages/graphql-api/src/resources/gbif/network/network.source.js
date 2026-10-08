import GbifRESTDataSource from '../../../datasources/GbifRESTDataSource.js';
import { stringify } from 'qs';

class NetworkAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiv1;
  }

  async searchNetworks({ query }) {
    return this.get('/network', {
      params: stringify(query, { indices: false }),
    });
  }

  async getNetworkByKey({ key }) {
    return this.get(`/network/${key}`);
  }

  async getConstituents({ key, query }) {
    return this.get(`/network/${key}/constituents`, {
      params: stringify(query, { indices: false }),
    });
  }

  async getOrganizations({ key, query }) {
    return this.get(`/network/${key}/organization`, {
      params: stringify(query, { indices: false }),
    });
  }

}

export default NetworkAPI;
