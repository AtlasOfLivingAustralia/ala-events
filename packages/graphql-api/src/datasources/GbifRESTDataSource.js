import { RESTDataSource } from '@apollo/datasource-rest';

/**
 * Shared REST data source for GBIF GraphQL.
 * Preserves apollo-datasource-rest URL joining (leading slash keeps baseURL path)
 * and stores request context / app config on the instance.
 */
class GbifRESTDataSource extends RESTDataSource {
  constructor(options = {}) {
    const { cache, context, config } = options;
    super({ cache });
    this.context = context;
    this.config = config;
  }

  /**
   * Strip one leading slash so paths like `/dataset/x` resolve against
   * `baseURL` path components (e.g. `https://api.gbif.org/v1`). Absolute
   * URLs pass through unchanged.
   */
  resolveURL(path) {
    if (/^https?:\/\//i.test(path)) {
      return new URL(path);
    }
    let resolvedPath = path;
    if (resolvedPath.startsWith('/')) {
      resolvedPath = resolvedPath.slice(1);
    }
    const baseURL = this.baseURL;
    if (baseURL) {
      const normalizedBaseURL = baseURL.endsWith('/')
        ? baseURL
        : `${baseURL}/`;
      return new URL(resolvedPath, normalizedBaseURL);
    }
    return new URL(resolvedPath);
  }

  /**
   * Accept qs.stringify strings as well as records / URLSearchParams.
   */
  urlSearchParamsFromRecord(params) {
    if (typeof params === 'string') {
      return new URLSearchParams(params);
    }
    return super.urlSearchParamsFromRecord(params);
  }

  willSendRequest(_path, request) {
    if (this.context?.userAgent) {
      request.headers['user-agent'] = this.context.userAgent;
    }
    if (this.context?.referer) {
      request.headers.referer = this.context.referer;
    }
  }
}

export default GbifRESTDataSource;
