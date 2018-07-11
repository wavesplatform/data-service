const { propEq, map, head } = require('ramda');
const Maybe = require('folktale/maybe');

const createExchangeAdapter = require('./transactions/exchange');
const createDataAdapter = require('./transactions/data');
const createAliasesAdapter = require('./aliases');

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

    transactions: {
      exchange: createExchangeAdapter(options),
      data: createDataAdapter(options),
    },

    aliases: createAliasesAdapter(options),
  };
};

module.exports = createDbAdapter;
