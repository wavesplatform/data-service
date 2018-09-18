const { propEq, map, head } = require('ramda');
const Maybe = require('folktale/maybe');

const { toDbError } = require('../../../errorHandling');

module.exports = ({ pg, sql, batchQuery }) => {
  /** assets.mget :: AssetId[] -> Task (Maybe Result)[] AppError.Db */
  const mget = assetIds =>
    pg
      .any(sql(assetIds))
      .map(batchQuery(propEq('asset_id'), assetIds))
      .map(map(Maybe.fromNullable))
      .mapRejected(toDbError({ request: 'assets', params: assetIds }));

  return {
    mget,
    /** assets.get :: AssetId -> Task (Maybe Result) AppError.Db */
    get: id => mget([id]).map(head),
  };
};
