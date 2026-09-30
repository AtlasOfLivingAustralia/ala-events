import GbifRESTDataSource from '../../../../../datasources/GbifRESTDataSource.js';

function reduce(response) {
  const givenNames = response?.person?.name?.['given-names']?.value;
  const familyName = response?.person?.name?.['family-name']?.value;
  const name =
    givenNames || familyName
      ? `${givenNames || ''} ${familyName || ''}`.trim()
      : null;
  return {
    source: {
      type: 'ORCID',
    },
    key: response?.['orcid-identifier']?.path,
    name,
    raw: response,
  };
}

class OrcidAPI extends GbifRESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = this.config.orcid.pubApi;
  }

  // eslint-disable-next-line class-methods-use-this
  willSendRequest(path, request) {
    request.headers.Accept = 'application/json';
    super.willSendRequest(path, request);
  }

  async getOrcidByKey({ key }) {
    return this.get(`/${key}/record`).then(reduce);
  }
}

export default OrcidAPI;
