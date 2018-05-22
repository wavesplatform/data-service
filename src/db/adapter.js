const { propEq, map, head } = require('ramda');
const Maybe = require('folktale/maybe');

const sql = require('./sql');

// db adapter factory
const createDbAdapter = ({
  taskedDbDriver: dbT,
  batchQueryFn,
  errorFactory,
}) => {
  return {
    assets: {
      /** assets.many :: AssetId[] -> Task (Maybe Result)[] AppError.Db */
      many(assetIds) {
        return dbT
          .any(sql.assets, [assetIds])
          .map(batchQueryFn(propEq('asset_id'), assetIds))
          .map(map(Maybe.fromNullable))
          .mapRejected(errorFactory({ request: 'assets', params: assetIds }));
      },

      /** assets.one :: AssetId -> Task (Maybe Result) AppError.Db */
      one(id) {
        return this.many([id]).map(head);
      },
    },

    pairs: {
      // Type Pair serialized as '{assetId1}/{assetId2}'
      /** pairs.one :: Pair -> Task (Maybe Result) AppError.Db */
      one(x) {
        return dbT
          .oneOrNone(sql.pair, x)
          .map(Maybe.fromNullable)
          .mapRejected(errorFactory({ request: 'pairs.one', params: x }));
      },

      /** pairs.many :: Pair -> Task (Maybe Result) AppError.Db */
      many(xs) {
        return dbT
          .task(t => t.batch(xs.map(x => t.oneOrNone(sql.pair, x))))
          .map(map(Maybe.fromNullable))
          .mapRejected(errorFactory({ request: 'pairs.many', params: xs }));
      },
    },

    transactions: {
      exchange: {
        one() {
          return dbT
            .any(sql.assets, ['WAVES'])
            .map(() => require('./exchange.mock'))
            .map(Maybe.of);
        },
      },
    },
  };
};

module.exports = createDbAdapter;
