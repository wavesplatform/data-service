const { propEq, map, head } = require('ramda');
const Maybe = require('folktale/maybe');

const { toDbError } = require('../../../errorHandling');

module.exports = ({ pg, sql, batchQuery }) => ({
  /** assets.mget :: AssetId[] -> Task (Maybe Result)[] AppError.Db */
  mget(assetIds) {
    return pg
      .any(sql(assetIds))
      .map(batchQuery(propEq('asset_id'), assetIds))
      .map(map(Maybe.fromNullable))
      .mapRejected(toDbError({ request: 'assets', params: assetIds }));
  },

  /** assets.get :: AssetId -> Task (Maybe Result) AppError.Db */
  get(id) {
    return this.mget([id]).map(head);
  },
});
