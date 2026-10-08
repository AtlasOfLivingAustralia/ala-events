import GbifRESTDataSource from '../../../datasources/GbifRESTDataSource.js';
import { stringify } from 'qs';

class VocabularyAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.apiv1;
  }

  // since vocabulary search expose non releasd vocabularies, we will remove this option for now
  // async searchVocabularies({ query }) {
  //   return this.get('/vocabularies', {
  //     params: stringify(query, { indices: false }),
  //   });
  // }

  async getVocabulary({ key }) {
    return this.get(`/vocabularies/${key}`);
  }

  async searchConcepts({ vocabulary, query }) {
    return this.get(`/vocabularies/${vocabulary}/concepts/latestRelease`, {
      params: stringify(query, { indices: false }),
    });
  }

  async getConcept({ vocabulary, concept, query }) {
    return this.get(`/vocabularies/${vocabulary}/concepts/latestRelease/${concept}`, {
      params: stringify(query, { indices: false }),
    });
  }
}

export default VocabularyAPI;
