const { getByIdPreset } = require('../presets/pg/getById');
const { mgetByIdsPreset } = require('../presets/pg/mgetByIds');
const search = require('../presets/pg/search');
const { pair } = require('../../types');

const {
  inputGet,
  inputMget,
  inputSearch,
  result: resultSchema,
} = require('./schema');
const { transformResult, transformResultSearch } = require('./transformResult');
const sql = require('./sql');
const matchRequestResult = require('./matchRequestResult');

module.exports = ({ drivers, emitEvent }) => {
  return {
    get: getByIdPreset({
      name: 'pairs.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema,
      transformResult: transformResult,
      resultTypeFactory: pair,
    })({ pg: drivers.pg, emitEvent }),
    mget: mgetByIdsPreset({
      name: 'pairs.mget',
      sql: sql.mget,
      inputSchema: inputMget,
      resultSchema,
      transformResult: transformResult,
      matchRequestResult: matchRequestResult,
      resultTypeFactory: pair,
    })({ pg: drivers.pg, emitEvent }),
    search: search({
      name: 'pairs.search',
      sql: sql.search,
      inputSchema: inputSearch,
      resultSchema,
      transformResult: transformResultSearch,
    })({ pg: drivers.pg, emitEvent }),
  };
};
