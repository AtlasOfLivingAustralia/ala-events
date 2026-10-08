import GbifRESTDataSource from '../../../datasources/GbifRESTDataSource.js';
import { ResourceSearchAPI } from '../resource/resource.source.js';
import { stringify } from 'qs';
import pick from 'lodash/pick.js';
import { createSignedGetHeader } from '../../../helpers/auth/authenticatedGet.js';

/**
 * This resource is from the directory API, which is not a public API.
 * Much of the data can be public though, but be cautious when adding new fields.
 */
class ParticipantDirectoryAPI extends GbifRESTDataSource {
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
  reduceParticipant(participant) {
    return pick(participant, [
      'id',
      'abbreviatedName',
      'name',
      'type',
      'participationStatus',
      'participantUrl',
      'membershipStart',
      'gbifRegion',
      'countryCode',
      'created',
      'modified',
    ]);
  }

  async searchParticipants({ query }) {
    const response = await this.get('/directory/participant', {
      params: stringify(query, { indices: false }),
    });
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    response.results = response.results.map((p) => this.reduceParticipant(p));
    return response;
  }

  async getParticipantByKey({ key }) {
    const participant = await this.get(`/directory/participant/${key}`);
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    return this.reduceParticipant(participant);
  }
}

class ParticipantAPI {
  constructor(options) {
    this.directoryAPI = new ParticipantDirectoryAPI(options);
    this.resourceSearchAPI = new ResourceSearchAPI(options);
  }

  async searchParticipants({ query }, locale) {
    const response = await this.directoryAPI.searchParticipants({ query });
    if (!response) return;

    const resourceParticipants = await Promise.allSettled(response.results.map(p => this.resourceSearchAPI.getFirstEntryByQuery({ directoryId: p.id }, locale)));

    response.results = response.results.map((directoryParticipant, i) => {
      if (resourceParticipants[i].status === 'fulfilled') {
        return this.#mergeParticipantData(directoryParticipant, resourceParticipants[i].value);
      }
      return directoryParticipant;
    });

    return response;
  }

  async getParticipantByDirectoryId({ id, locale }) {
    const directoryParticipant = await this.directoryAPI.getParticipantByKey({ key: id });
    if (!directoryParticipant) return;

    const resourceParticipant = await this.resourceSearchAPI.getFirstEntryByQuery({ directoryId: id }, locale);
    if (resourceParticipant) {
      return this.#mergeParticipantData(directoryParticipant, resourceParticipant);
    }

    return directoryParticipant;
  }

  async mergeParticipantDirectoryData(resourceParticipant) {
    console.log(resourceParticipant);
    // If the resource does not have a directoryId, we return the resource as is.
    if (!resourceParticipant.directoryId) return resourceParticipant;

    const directoryParticipant = await this.directoryAPI.getParticipantByKey({ key: resourceParticipant.directoryId });
    if (directoryParticipant) {
      return this.#mergeParticipantData(directoryParticipant, resourceParticipant);
    }

    return resourceParticipant;
  }

  #mergeParticipantData(directoryParticipant, resourceParticipant) {
    return {
      ...resourceParticipant,
      ...directoryParticipant,
    };
  }
}

export default ParticipantAPI;
