import GbifRESTDataSource from '../../../datasources/GbifRESTDataSource.js';
import { stringify } from 'qs';

class CollectionAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiv1;
  }

  async searchCollections({ query }) {
    return this.get('/grscicoll/collection', {
      params: stringify(query, { indices: false }),
    });
  }

  async getCollectionByKey({ key }) {
    return this.get(`/grscicoll/collection/${key}`);
  }

  async getCollectionsByInstitutionKey({ key, limit = 20, offset = 0 }) {
    return this.get('/grscicoll/collection', {
      params: {
        institution: key,
        limit,
        offset,
      },
      }).then((res) => res.results);
  }

  /*
  getCollectionsByKeys({ collectionKeys }) {
    return Promise.all(
      collectionKeys.map(key => this.getCollectionByKey({ key })),
    );
  }
  */
}

export default CollectionAPI;
