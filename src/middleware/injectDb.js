const compose = require('koa-compose');

const { createPgDriver, createRedisDriver } = require('../db');
const inject = require('./inject');

module.exports = options => {
  const pgDriver = createPgDriver(options);
  const redisDriver = createRedisDriver(options);

  return compose([
    inject(['drivers', 'pg'], pgDriver),
    inject(['drivers', 'redis'], redisDriver),
  ]);
};
