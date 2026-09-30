import GbifRESTDataSource from '../../../datasources/GbifRESTDataSource.js';
import { stringify } from 'qs';

class StaffMemberAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiv1;
  }

  async searchStaff({ query }) {
    return this.get('/grscicoll/person', {
      params: stringify(query, { indices: false }),
    });
  }

  async getStaffByKey({ key }) {
    return this.get(`/grscicoll/person/${key}`);
  }

  /*
  getPersonsByKeys({ personKeys }) {
    return Promise.all(
      personKeys.map(key => this.getPersonByKey({ key })),
    );
  }
  */
}

export default StaffMemberAPI;
