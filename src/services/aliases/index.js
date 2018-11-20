const getByIdPreset = require('../presets/pg/getById');
const search = require('../presets/pg/search');

const { Alias } = require('../../types');

const sql = require('./data/sql');
const transformResult = require('./data/transformResults');

const { inputGet, inputSearch, output } = require('./schema');

module.exports = ({ drivers, emitEvent }) => {
  return {
    get: getByIdPreset({
      name: 'aliases.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema: output,
      transformResult: transformResult,
      resultTypeFactory: Alias,
    })({ pg: drivers.pg, emitEvent: emitEvent }),

    search: search({
      name: 'aliases.search',
      sql: sql.mget,
      inputSchema: inputSearch,
      resultSchema: output,
      transformResult: transformResult,
      resultTypeFactory: Alias
    })({ pg: drivers.pg, emitEvent: emitEvent }),
  };
};
