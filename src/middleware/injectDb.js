const compose = require('koa-compose');

const { createPgDriver, createRedisDriver, createAdapter } = require('../db');
const inject = require('./inject');

module.exports = options => {
  const pgDriver = createPgDriver(options);
  const redisDriver = createRedisDriver(options);

  return compose([
    inject(['drivers', 'pg'], pgDriver),
    inject(['drivers', 'redis'], redisDriver),
    inject(['db'], createAdapter(pgDriver)),
  ]);
};
