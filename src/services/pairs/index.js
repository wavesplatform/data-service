const getById = require('../presets/pg/getById');
const mgetByIds = require('../presets/pg/mgetByIds');
const { Pair } = require('../../types');

const { inputPair, inputPairs, output } = require('./schema');
const transformResult = require('./transformResult');
const { get, mget } = require('./sql');
const { matchPairs } = require('./matcher');

module.exports = ({ drivers, emitEvent }) => {
  return {
    get: getById({
      nae: 'pairs.get',
      sql: get,
      inputSchema: inputPair,
      resultSchema: output,
      transformResult: transformResult,
      resultTypeFactory: Pair,
    })({ pg: drivers.pg, emitEvent }),
    mget: mgetByIds({
      nae: 'pairs.mget',
      sql: mget,
      inputSchema: inputPairs,
      resultSchema: output,
      transformResult: transformResult,
      matchRequestResult: matchPairs,
      resultTypeFactory: Pair,
    })({ pg: drivers.pg, emitEvent }),
  };
};
