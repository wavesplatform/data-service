const {
  compose,
  cond,
  equals,
  filter,
  forEach,
  length,
  map,
  T,
  tap,
} = require('ramda');
const { of: maybeOf, empty } = require('folktale/maybe');
const { of: taskOf } = require('folktale/concurrency/task');
const { getByIdPreset } = require('../presets/pg/getById');
const { mgetByIdsPreset } = require('../presets/pg/mgetByIds');
const { searchPreset } = require('../presets/pg/search');
const { pair } = require('../../types');
const createIssueTxsService = require('../transactions/issue');

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

      // request asset list
      const assets = [request.amountAsset, request.priceAsset].filter(
        assetId => assetId !== 'WAVES'
      );

      // try to get assets from cache
      const cached = cache.mget(assets);

      const notCached = assets.filter(assetId => !cached[assetId]);

      if (notCached.length === 0) {
        // both of assets are cached
        return getPairT;
      } else {
        return createIssueTxsService({ drivers, emitEvent })
          .mget(notCached)
          .chain(
            compose(
              cond([
                [equals(notCached.length), () => getPairT],
                [T, () => taskOf(empty())],
              ]),
              length,
              tap(forEach(tx => cache.set(tx.id, tx))),
              map(tx => tx.data),
              filter(tx => tx.data !== null),
              list => list.data
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

      // request asset list
      const assets = request
        .reduce((acc, pair) => [...acc, pair.amountAsset, pair.priceAsset], [])
        .filter(assetId => assetId !== 'WAVES');

      // try to get all assets from cache
      const cached = cache.mget(assets);

      const notCached = assets.filter(assetId => !cached[assetId]);

      if (notCached.length === 0) {
        // all of assets are in cache
        return mgetPairsT;
      } else {
        return createIssueTxsService({ drivers, emitEvent })
          .mget(notCached)
          .chain(
            compose(
              cond([
                [equals(notCached.length), () => mgetPairsT],
                [T, () => taskOf(null)],
              ]),
              length,
              tap(forEach(tx => cache.set(tx.id, tx))),
              map(tx => tx.data),
              filter(tx => tx.data !== null),
              list => list.data
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
