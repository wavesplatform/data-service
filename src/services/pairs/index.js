const getById = require('../presets/pg/getById');
const mgetByIds = require('../presets/pg/mgetByIds');
const search = require('../presets/pg/search');
const { Pair } = require('../../types');

const {
  inputGet,
  inputMget,
  inputSearch,
  result: resultSchema,
} = require('./schema');
const { transformResult, transformResultSearch } = require('./transformResult');
const { get: sqlGet, mget: sqlMget, search: sqlSearch } = require('./sql');
const matchRequestResult = require('./matchRequestResult');

module.exports = ({ drivers, emitEvent }) => {
  return {
    get: getById({
      name: 'pairs.get',
      sql: sqlGet,
      inputSchema: inputGet,
      resultSchema,
      transformResult: transformResult,
      resultTypeFactory: Pair,
    })({ pg: drivers.pg, emitEvent }),
    mget: mgetByIds({
      name: 'pairs.mget',
      sql: sqlMget,
      inputSchema: inputMget,
      resultSchema,
      transformResult: transformResult,
      matchRequestResult: matchRequestResult,
      resultTypeFactory: Pair,
    })({ pg: drivers.pg, emitEvent }),
    search: search({
      name: 'pairs.search',
      sql: sqlSearch,
      inputSchema: inputSearch,
      resultSchema,
      transformResult: transformResultSearch,
    })({ pg: drivers.pg, emitEvent }),
  };
};
