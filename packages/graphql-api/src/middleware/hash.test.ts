import assert from 'assert';
import hashMiddleware from './hash.ts';

function mockRes() {
  const headers = {};
  return {
    headers,
    set(key, value) {
      headers[key] = value;
    },
    status() {
      return this;
    },
    json() {
      return this;
    },
    get(key) {
      return headers[key];
    },
  };
}

describe('hashMiddleware', () => {
  it('does not throw when POST has no body', (done) => {
    const req = {
      method: 'POST',
      query: {},
      // body intentionally missing
    };
    const res = mockRes();
    hashMiddleware(req, res, (err) => {
      assert.ifError(err);
      done();
    });
  });
});
