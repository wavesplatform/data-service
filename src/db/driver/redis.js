// Module transforms node-redis into a subset of methods
// returning Task
const redis = require('redis');

const { fromNodeback } = require('folktale/concurrency/task');
const { map, pick, compose, memoizeWith, always } = require('ramda');

const createTaskedDriver = options => {
  if (!options.redisHost || !options.redisPort) return null;

  const driverP = redis.createClient(options.redisPort, options.redisHost);

  return compose(
    map(fromNodeback),
    pick(['get', 'set', 'mget', 'mset'])
  )(driverP);
};

module.exports = memoizeWith(always('driverT'), createTaskedDriver);
