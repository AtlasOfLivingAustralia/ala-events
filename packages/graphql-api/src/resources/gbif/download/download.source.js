import GbifRESTDataSource from '../../../datasources/GbifRESTDataSource.js';

class DownloadAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiv1;
  }

  async datasetDownloads({ query }) {
    const { datasetKey, ...params } = query;
    return this.get(`/occurrence/download/dataset/${datasetKey}`, { params });
  }

  async getDownloadByKey({ key }) {
    return this.get(`/occurrence/download/${key}`);
  }

  /*
  getDownloadsByKeys({ downloadKeys }) {
    return Promise.all(
      downloadKeys.map(key => this.getDownloadByKey({ key })),
    );
  }
  */
}

export default DownloadAPI;
