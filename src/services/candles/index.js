const search = require('../presets/pg/search');

const { candle } = require('../../types');

const { sql } = require('./sql');
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
      resultTypeFactory: candle,
    })({ pg: drivers.pg, emitEvent: emitEvent }),
  };
};
