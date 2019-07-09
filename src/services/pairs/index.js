const { of: maybeOf, empty } = require('folktale/maybe');
const { of: taskOf } = require('folktale/concurrency/task');
const { getByIdPreset } = require('../presets/pg/getById');
const { mgetByIdsPreset } = require('../presets/pg/mgetByIds');
const { searchPreset } = require('../presets/pg/search');
const { pair } = require('../../types');
const assets = require('../assets');

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

module.exports = ({ drivers, emitEvent }) => {
  return {
    get: request =>
      getByIdPreset({
        name: 'pairs.get',
        sql: sql.get,
        inputSchema: inputGet,
        resultSchema,
        transformResult: transformResult,
        resultTypeFactory: pair,
      })({ pg: drivers.pg, emitEvent })(request).chain(maybePair =>
        taskOf(
          maybePair.matchWith({
            Just: () => maybePair,
            Nothing: () =>
              assets({ drivers, emitEvent })
                .mget([request.amountAsset, request.priceAsset])
                .run()
                .promise()
                .then(res =>
                  // no one of assets are not found ? not found : empty pair
                  res.data.filter(asset => asset.data === null).length > 0
                    ? empty()
                    : maybeOf(createEmptyPair())
                ),
          })
        )
      ),
    mget: mgetByIdsPreset({
      name: 'pairs.mget',
      sql: sql.mget,
      inputSchema: inputMget,
      resultSchema,
      transformResult: transformResult,
      matchRequestResult: matchRequestResult,
      resultTypeFactory: pair,
    })({ pg: drivers.pg, emitEvent }),
    search: searchPreset({
      name: 'pairs.search',
      sql: sql.search,
      inputSchema: inputSearch,
      resultSchema,
      transformResult: transformResultSearch,
    })({ pg: drivers.pg, emitEvent }),
  };
};
