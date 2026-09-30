import GbifRESTDataSource from '../../../datasources/GbifRESTDataSource.js';
import { stringify } from 'qs';

class OrganizationAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiv1;
  }

  async searchOrganizations({ query }) {
    return this.get('/organization', {
      params: stringify(query, { indices: false }),
    });
  }

  async getOrganizationByKey({ key }) {
    return this.get(`/organization/${key}`);
  }

  getOrganizationsByKeys({ organizationKeys }) {
    return Promise.all(
      organizationKeys.map((key) => this.getOrganizationByKey({ key })),
    );
  }

  async getHostedDatasets({ key, query }) {
    return this.get(`/organization/${key}/hostedDataset`, {
      params: stringify(query, { indices: false }),
    });
  }

  async getPublishedDatasets({ key, query }) {
    return this.get(`/organization/${key}/publishedDataset`, {
      params: stringify(query, { indices: false }),
    });
  }

  async getInstallations({ key, query }) {
    return this.get(`/organization/${key}/installation`, {
      params: stringify(query, { indices: false }),
    });
  }
}

export default OrganizationAPI;
