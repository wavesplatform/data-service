const { getByIdPreset } = require('../presets/pg/getById');
const { searchPreset } = require('../presets/pg/search');

const { alias } = require('../../types');

const sql = require('./data/sql');
const transformGet = require('./data/transformResult');
const { transformResults } = require('../presets/pg/search/transformResult');

const { inputGet, inputSearch, output } = require('./schema');

module.exports = ({ drivers, emitEvent }) => {
  return {
    get: getByIdPreset({
      name: 'aliases.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema: output,
      transformResult: transformGet,
      resultTypeFactory: alias,
    })({ pg: drivers.pg, emitEvent: emitEvent }),

    search: searchPreset({
      name: 'aliases.search',
      sql: sql.search,
      inputSchema: inputSearch,
      resultSchema: output,
      transformResult: transformResults(alias)(transformGet),
      resultTypeFactory: alias,
    })({ pg: drivers.pg, emitEvent: emitEvent }),
  };
};
