import GbifRESTDataSource from '../../../datasources/GbifRESTDataSource.js';
import { stringify } from 'qs';

class GadmAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiv1;
  }

  async getGadmById({ id }) {
    return this.get(`/geocode/gadm/${id}`);
  }
}

export default GadmAPI;
