const { propEq } = require('ramda');

// db init
const convertDbToTasked = require('./convertDbToTasked');

// query and formatting
const sql = require('../sql');
const { formatPairs, batchQuery } = require('../utils');

// error handling
const { toDbError } = require('../../errorHandling');

// db adapter factory
const createDbAdapter = db => {
  const taskDb = convertDbToTasked(db);

  return {
    assets: assetIdArr =>
      taskDb
        .many(sql.assets, [assetIdArr])
        .map(batchQuery(propEq('asset_id'), assetIdArr))
        .mapRejected(toDbError({ request: 'assets' })),
    // volumes: pairs => db.many(sql.volumes, formatPairs(pairs)),
  };
};

module.exports = createDbAdapter;
