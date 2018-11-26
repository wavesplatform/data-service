const getByIdPreset = require('../presets/pg/getById');
const search = require('../presets/pg/search');

const { Alias } = require('../../types');

const sql = require('./data/sql');
const { transformGet, transformSearch } = require('./data/transformResult');

const { inputGet, inputSearch, output } = require('./schema');

module.exports = ({ drivers, emitEvent }) => {
  return {
    get: getByIdPreset({
      name: 'aliases.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema: output,
      transformResult: transformGet,
      resultTypeFactory: Alias,
    })({ pg: drivers.pg, emitEvent: emitEvent }),

    search: search({
      name: 'aliases.search',
      sql: sql.mget,
      inputSchema: inputSearch,
      resultSchema: output,
      transformResult: transformSearch,
      resultTypeFactory: Alias
    })({ pg: drivers.pg, emitEvent: emitEvent }),
  };
};
