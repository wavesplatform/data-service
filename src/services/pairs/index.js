const getById = require('../presets/pg/getById');
const mgetByIds = require('../presets/pg/mgetByIds');
const { Pair } = require('../../types');

const { inputPair, inputPairs, result } = require('./schema');
const transformResult = require('./transformResult');
const { get, mget } = require('./sql');
const matchRequestResult = require('./matchRequestResult');

module.exports = ({ drivers, emitEvent }) => {
  return {
    get: getById({
      name: 'pairs.get',
      sql: get,
      inputSchema: inputPair,
      resultSchema: result,
      transformResult: transformResult,
      resultTypeFactory: Pair,
    })({ pg: drivers.pg, emitEvent }),
    mget: mgetByIds({
      name: 'pairs.mget',
      sql: mget,
      inputSchema: inputPairs,
      resultSchema: result,
      transformResult: transformResult,
      matchRequestResult: matchRequestResult,
      resultTypeFactory: Pair,
    })({ pg: drivers.pg, emitEvent }),
  };
};
