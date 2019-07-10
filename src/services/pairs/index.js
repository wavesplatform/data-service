const {
  compose,
  cond,
  equals,
  filter,
  forEach,
  length,
  map,
  T,
} = require('ramda');
const { of: maybeOf, empty } = require('folktale/maybe');
const { of: taskOf } = require('folktale/concurrency/task');
const { getByIdPreset } = require('../presets/pg/getById');
const { mgetByIdsPreset } = require('../presets/pg/mgetByIds');
const { searchPreset } = require('../presets/pg/search');
const { pair } = require('../../types');
const createAssetsService = require('../assets');

const {
  inputGet,
  inputMget,
  inputSearch,
  result: resultSchema,
} = require('./schema');
const {
  transformResult,
  transformResultSearch,
  createEmptyPair,
} = require('./transformResult');
const sql = require('./sql');
const matchRequestResult = require('./matchRequestResult');

module.exports = ({ drivers, emitEvent, orderPair, cache }) => {
  return {
    get: request => {
      const getPairT = getByIdPreset({
        name: 'pairs.get',
        sql: sql.get,
        inputSchema: inputGet(orderPair),
        resultSchema,
        transformResult: transformResult,
        resultTypeFactory: pair,
      })({ pg: drivers.pg, emitEvent })(request).chain(maybePair =>
        taskOf(
          maybePair.matchWith({
            Just: () => maybePair,
            Nothing: () => maybeOf(createEmptyPair()),
          })
        )
      );

      // try to get assets from cache
      const values = cache.mget([request.amountAsset, request.priceAsset]);

      if (values[request.amountAsset] && values[request.priceAsset]) {
        // both of assets are cached
        return getPairT;
      } else {
        return createAssetsService({ drivers, emitEvent })
          .mget([request.amountAsset, request.priceAsset])
          .chain(
            compose(
              cond([equals(2), getPairT, T, taskOf(empty())]),
              length,
              forEach(asset => cache.set(asset.id, asset)),
              map(asset => asset.data),
              filter(asset => asset.data !== null)
            )
          );
      }
    },
    mget: request => {
      const mgetPairsT = mgetByIdsPreset({
        name: 'pairs.mget',
        sql: sql.mget,
        inputSchema: inputMget(orderPair),
        resultSchema,
        transformResult: transformResult,
        matchRequestResult: matchRequestResult,
        resultTypeFactory: pair,
      })({ pg: drivers.pg, emitEvent })(request);

      // full assets list
      const assets = request.reduce(
        (acc, pair) => [...acc, pair.amountAsset, pair.priceAsset],
        []
      );
      // try to get all assets from cache
      const values = cache.mget(assets);

      if (
        Object.values(values).filter(assetOrNull => assetOrNull !== null)
          .length === assets.length
      ) {
        // all assets were in cache
        return mgetPairsT;
      } else {
        return createAssetsService({ drivers, emitEvent })
          .mget(assets)
          .chain(
            compose(
              cond([equals(assets.length), mgetPairsT, T, taskOf(null)]),
              length,
              forEach(asset => cache.set(asset.id, asset)),
              map(asset => asset.data),
              filter(asset => asset.data !== null)
            )
          );
      }
    },
    search: searchPreset({
      name: 'pairs.search',
      sql: sql.search,
      inputSchema: inputSearch,
      resultSchema,
      transformResult: transformResultSearch,
    })({ pg: drivers.pg, emitEvent }),
  };
};
