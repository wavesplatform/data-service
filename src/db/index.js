const createTaskedDriver = require('./driver');
const createAdapter = require('./adapter');

// adapter dependencies
const { toDbError } = require('../errorHandling');
const { batchQuery } = require('./utils');

module.exports = options => {
  const taskedDbDriver = createTaskedDriver(options);
  const adapter = createAdapter({
    taskedDbDriver,
    errorFactory: toDbError,
    batchQueryFn: batchQuery,
  });
  return adapter;
};
