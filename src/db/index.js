const createTaskedDriver = require('./driver');
const createAdapter = require('./adapter');

// adapter dependencies
const { toDbError } = require('../errorHandling');
const { batchQuery } = require('./utils');
const sql = require('./sql');

module.exports = {
  createDriver: createTaskedDriver,
  createAdapter: driver =>
    createAdapter({
      taskedDbDriver: driver,
      errorFactory: toDbError,
      batchQueryFn: batchQuery,
      sql,
    }),
};
