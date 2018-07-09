const createAdapter = require('./adapter');
const createDriver = require('./driver');

const createSql = require('./sql');

const Task = require('folktale/concurrency/task');

module.exports = {
  driver: {
    create: createDriver,
    createT: createDriver(Task.of),
  },
  adapter: {
    create: createAdapter,
    good: (transformFn, sql) =>
      createAdapter(createDriver(Task.of, transformFn), sql),
    bad: (transformFn, sql) =>
      createAdapter(createDriver(Task.rejected, transformFn), sql),
  },
  sql: {
    create: createSql,
  },
};
