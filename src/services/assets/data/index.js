const { propEq, map, head } = require('ramda');
const Maybe = require('folktale/maybe');

const batchQuery = require('./batchQuery');
const { toDbError } = require('../../../errorHandling');

const sqlQuery = require('./sql');

module.exports = ({ pg, sql = sqlQuery }) => ({
  /** assets.mget :: AssetId[] -> Task (Maybe Result)[] AppError.Db */
  mget(assetIds) {
    return pg
      .any(sql.raw.assets, [assetIds])
      .map(batchQuery(propEq('asset_id'), assetIds))
      .map(map(Maybe.fromNullable))
      .mapRejected(toDbError({ request: 'assets', params: assetIds }));
  },

  /** assets.get :: AssetId -> Task (Maybe Result) AppError.Db */
  get(id) {
    return this.mget([id]).map(head);
  },
});
