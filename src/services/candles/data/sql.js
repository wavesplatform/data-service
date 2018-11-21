const pg = require('knex')({ client: 'pg' });

module.exports = filters =>
  pg('candles')
    .select('*')
    .whereBetween('timestamp', [filters.timeStart, filters.timeEnd]);
