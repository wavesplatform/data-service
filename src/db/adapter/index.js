// query and formatting
const sql = require('../sql');
const { formatPairs, batchQuery } = require('../utils');

// error handling
const { toDbError } = require('../../errorHandling');

// db adapter factory
const createDbAdapter = taskedDBDriver => {
  return {
    assets: assetIdArr =>
      taskedDBDriver
        .many(sql.assets, [assetIdArr])
        // .map(batchQuery((reqId, { id }) => reqId === id, assetIdArr))
        .mapRejected(toDbError({ request: 'assets' })),
    // compose(
    // batchQuery((reqId, { id }) => reqId === id, assetIdArr),
    // a => { console.log(a); return a},
    // bind(db.many)
    // )(sql.assets, [assetIdArr]),
    // volumes: pairs => db.many(sql.volumes, formatPairs(pairs)),
  };
};

module.exports = createDbAdapter;
