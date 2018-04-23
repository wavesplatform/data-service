const { propEq } = require('ramda');

// query and formatting
const sql = require('../sql');
// const { formatPairs } = require('../utils');
// db adapter factory
const createDbAdapter = ({ taskedDbDriver, batchQueryFn, errorFactory }) => {
  return {
    assets: assetIdArr =>
      taskedDbDriver
        .many(sql.assets, [assetIdArr])
        .map(batchQueryFn(propEq('asset_id'), assetIdArr))
        .mapRejected(e => errorFactory({ request: 'assets' }, e)),

    // volumes: pairs => db.many(sql.volumes, formatPairs(pairs)),
  };
};

module.exports = createDbAdapter;
