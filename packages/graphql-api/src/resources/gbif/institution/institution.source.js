import GbifRESTDataSource from '../../../datasources/GbifRESTDataSource.js';
import { stringify } from 'qs';

class InstitutionAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiv1;
  }

  async searchInstitutions({ query }) {
    return this.get('/grscicoll/institution', {
      params: stringify(query, { indices: false }),
    });
  }

  async getInstitutionByKey({ key }) {
    return this.get(`/grscicoll/institution/${key}`);
  }

  /*
  getInstitutionsByKeys({ institutionKeys }) {
    return Promise.all(
      institutionKeys.map(key => this.getInstitutionByKey({ key })),
    );
  }
  */
}

export default InstitutionAPI;
