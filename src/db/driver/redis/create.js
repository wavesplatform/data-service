const redis = require('redis');

const { memoizeWith, always } = require('ramda');

const createDriver = options => {
  if (!options.redisHost || !options.redisPort) return null;
  return redis.createClient(options.redisPort, options.redisHost);
};

module.exports = memoizeWith(always('driver'), createDriver);
