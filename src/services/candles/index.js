const search = require('../presets/pg/search');

const { Candle } = require('../../types');

const sql = require('./sql');
const { inputSearch, output } = require('./schema');
const { transformResults } = require('./transformResults');

module.exports = ({ drivers, emitEvent }) => {
  return {
    search: search({
      name: 'candles.search',
      sql,
      inputSchema: inputSearch,
      resultSchema: output,
      transformResult: transformResults,
      resultTypeFactory: Candle,
    })({ pg: drivers.pg, emitEvent: emitEvent }),
  };
};
