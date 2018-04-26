const { propEq, map } = require('ramda');

const Maybe = require('folktale/maybe');

// query and formatting
const sql = require('./sql');
// const { formatPairs } = require('../utils');

// db adapter factory
const createDbAdapter = ({ taskedDbDriver, batchQueryFn, errorFactory }) => {
  return {
    /** assets :: AssetId[] -> Task (Maybe Result) AppError.Db */
    assets: assetIdArr =>
      taskedDbDriver
        .many(sql.assets, [assetIdArr])
        .map(batchQueryFn(propEq('asset_id'), assetIdArr))
        .map(map(Maybe.fromNullable))
        .mapRejected(errorFactory({ request: 'assets' })),

    // volumes: pairs => db.many(sql.volumes, formatPairs(pairs)),
  };
};

module.exports = createDbAdapter;
