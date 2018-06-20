const { propEq, map, head } = require('ramda');
const Maybe = require('folktale/maybe');

const createExchangeAdapter = require('./transactions/exchange');
const createDataAdapter = require('./transactions/data');

// db adapter factory
const createDbAdapter = options => {
  const { taskedDbDriver: dbT, batchQueryFn, errorFactory, sql } = options;

  return {
    assets: {
      /** assets.many :: AssetId[] -> Task (Maybe Result)[] AppError.Db */
      many(assetIds) {
        return dbT
          .any(sql.raw.assets, [assetIds])
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
          .oneOrNone(sql.raw.pair, x)
          .map(Maybe.fromNullable)
          .mapRejected(errorFactory({ request: 'pairs.one', params: x }));
      },

      /** pairs.many :: Pair -> Task (Maybe Result) AppError.Db */
      many(xs) {
        return dbT
          .task(t => t.batch(xs.map(x => t.oneOrNone(sql.raw.pair, x))))
          .map(map(Maybe.fromNullable))
          .mapRejected(errorFactory({ request: 'pairs.many', params: xs }));
      },
    },

    transactions: {
      exchange: createExchangeAdapter(options),
      data: createDataAdapter(options),
    },

    aliases: {
      one(x) {
        return dbT
          .oneOrNone(sql.build.aliases.one(x))
          .map(Maybe.fromNullable)
          .mapRejected(errorFactory({ request: 'aliases.one', params: x }));
      },
      many({ address }) {
        return dbT
          .any(sql.build.aliases.many({ address }))
          .map(map(Maybe.fromNullable))
          .mapRejected(
            errorFactory({ request: 'aliases.many', params: { address } })
          );
      },
    },
  };
};

module.exports = createDbAdapter;
