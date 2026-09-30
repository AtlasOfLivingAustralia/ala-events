import { translateContentfulResponse, objectToQueryString } from '../../../helpers/utils.js';
import GbifRESTDataSource from '../../../datasources/GbifRESTDataSource.js';

export class ResourceAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiv1;
  }

  async getEntryById({ id, preview, locale }) {
    let path = `/content/${id}`;
    if (preview) path += `/preview?cacheBust=${Date.now()}`;

    const result = await this.get(path);
    return translateContentfulResponse(result, locale);
  }
}

export class ResourceSearchAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiEs;
  }

  search = async (params, locale) => {
    const response = await this.get(`/content`, {
      params: objectToQueryString(params),
    });
    return translateContentfulResponse(response.documents, locale);
  }

  async getFirstEntryByQuery(params, locale) {
    const response = await this.search(params, locale);
    return response.results[0];
  }
}
