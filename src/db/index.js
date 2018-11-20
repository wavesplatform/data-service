const { pg, redis } = require('./driver');

module.exports = {
  createPgDriver: pg,
  createRedisDriver: redis,
};
