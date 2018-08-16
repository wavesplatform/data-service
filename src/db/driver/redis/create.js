const redis = require('redis');

const { memoizeWith, always } = require('ramda');

const createDriver = options =>
  redis.createClient({
    host: options.redisHost,
    port: options.redisPort,
    password: options.redisPassword,
    enable_offline_queue: false,
    retry_strategy: options => {
      // in 60 mins of downtime, stop trying
      if (options.total_retry_time > 1000 * 60 * 60) {
        return undefined;
      }
      // reconnect after progressively increasing time
      return Math.min(options.attempt * 100, 3000);
    },
  });

module.exports = memoizeWith(always('driver'), createDriver);
