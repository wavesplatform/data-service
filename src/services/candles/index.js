const searchWithPagination = require('../presets/pg/searchWithPagination');

const getData = require('./data');
const { inputSearch } = require('./inputSchema');
const { outputSearch } = require('./resultSchema');
const transformResult = require('./transformResult');

module.exports = ({ drivers, emitEvent }) => {
  const data = getData({ pg: drivers.pg });

  return {
    search: searchWithPagination({
      name: 'candles.search',
      sql: data.search,
      inputSchema: inputSearch,
      resultSchema: outputSearch,
      transformResult,
    })({ pg: drivers.pg, emitEvent: emitEvent }),
  };
};
