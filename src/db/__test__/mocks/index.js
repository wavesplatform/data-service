const createDriver = require('./driver');

const createSql = require('./sql');

const Task = require('folktale/concurrency/task');

module.exports = {
  driver: {
    create: createDriver,
    createT: createDriver(Task.of),
  },
  sql: {
    create: createSql,
  },
};
