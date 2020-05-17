const got = require('got').default;
const QuickLRU = require('quick-lru');
const CacheableLookup = require('cacheable-lookup').default;
const config = require('config');
const clientConfig = config.get('httpClient');

module.exports = got.extend({
  cache: clientConfig.cache.http.enabled
    ? new QuickLRU({ maxSize: clientConfig.cache.http.size })
    : false,
  lookup: clientConfig.cache.dns.enabled ? new CacheableLookup().lookup : false,
  timeout: clientConfig.timeout,
});
