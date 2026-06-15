let { LRUCache } = require("lru-cache");
let queryCache = new LRUCache({ max: 10000 });

module.exports = {
  queryCache: queryCache
}