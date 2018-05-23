const createAdapter = require('../../adapter');

const createSqlProxy = require('./sql');

const createMockAdapter = (driver, sql = createSqlProxy()) =>
  createAdapter({
    taskedDbDriver: driver,
    batchQueryFn: () => x => x,
    errorFactory: () => x => x,
    sql,
  });

module.exports = createMockAdapter;
