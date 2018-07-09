const createRedisAdapter = require('./redis');
const createPgAdapter = require('./pg');

const createData = require('./create');

module.exports = ({ drivers, emitEvent }) =>
  createData({
    redisAdapter: createRedisAdapter(drivers),
    pgAdapter: createPgAdapter(drivers),
    emitEvent,
  });
