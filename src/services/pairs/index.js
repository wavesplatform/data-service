const getById = require('../presets/pg/getById');
const mgetByIds = require('../presets/pg/mgetByIds');
const { Pair } = require('../../types');

const { inputGet, inputMget, result: resultSchema } = require('./schema');
const transformResult = require('./transformResult');
const { get, mget } = require('./sql');
const matchRequestResult = require('./matchRequestResult');

module.exports = ({ drivers, emitEvent }) => {
  return {
    get: getById({
      name: 'pairs.get',
      sql: get,
      inputSchema: inputGet,
      resultSchema,
      transformResult: transformResult,
      resultTypeFactory: Pair,
    })({ pg: drivers.pg, emitEvent }),
    mget: mgetByIds({
      name: 'pairs.mget',
      sql: mget,
      inputSchema: inputMget,
      resultSchema,
      transformResult: transformResult,
      matchRequestResult: matchRequestResult,
      resultTypeFactory: Pair,
    })({ pg: drivers.pg, emitEvent }),
  };
};
