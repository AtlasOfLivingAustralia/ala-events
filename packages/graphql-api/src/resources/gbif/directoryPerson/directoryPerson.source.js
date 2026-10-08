/**
 * This resource is from the directory API, which is not a public API.
 * Much of the data can be public though, but be cautious when adding new fields.
 */

import GbifRESTDataSource from '../../../datasources/GbifRESTDataSource.js';
import { stringify } from 'qs';
import pick from 'lodash/pick.js';
import { createSignedGetHeader } from '../../../helpers/auth/authenticatedGet.js';

class DirectoryPersonAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiv1;
  }

  willSendRequest(path, request) {
    const header = createSignedGetHeader(path, this.config);
    Object.keys(header).forEach((x) => {
      request.headers[x] = header[x];
    });
    super.willSendRequest(path, request);
  }

  /*
   * The schemas already limits what is public, but to make it more difficult to
   * add something, we also sanitize the data before returning it.
   */
  // eslint-disable-next-line class-methods-use-this
  reduceDirectoryPerson(directoryPerson) {
    return pick(directoryPerson, [
      'id',
      'firstName',
      'surname',
      'title',
      'orcidId',
      'jobTitle',
      'institutionName',
      'roles',
      'countryCode',
      'certifications',
      'languages',
      'areasExpertise',
      'profileDescriptions',
      'created',
      'modified',
    ]);
  }

  async searchPeopleByRole({ query }) {
    const response = await this.get('/directory/person_role', {
      params: stringify(query, { indices: false }),
    });
    
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    // response.results = response.results.map((p) => this.reduceDirectoryPerson(p));
    return response;
  }

  async getDirectoryPersonByKey({ key }) {
    const directoryPerson = await this.get(`/directory/person/${key}`);
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    return this.reduceDirectoryPerson(directoryPerson);
  }

  async getProfilePicture({ key, query }) {
    return await this.get(`/directory/person/${key}/profilePicture`, {
      params: stringify(query, { indices: false }),
    });
  }

  /*
  getDirectoryPersonsByKeys({ directoryPersonKeys }) {
    return Promise.all(
      directoryPersonKeys.map(key => this.getDirectoryPersonByKey({ key })),
    );
  }
  */
}

export default DirectoryPersonAPI;
