const pg = require('knex')({ client: 'pg' });

const select = pg
  .select('*')
  .from('txs_12')
  .leftJoin('txs_12_data', 'txs_12.id', 'txs_12_data.tx_id');

const fSelect = pg
  .select('id')
  .min({ time_stamp: 'time_stamp' })
  .from('txs_12')
  .leftJoin('txs_12_data', 'txs_12.id', 'txs_12_data.tx_id')
  .groupBy('id');

// filtering query should include sort
const composeQuery = filteringQ =>
  select.clone().whereIn('id', pg.select('id').from({ filtered: filteringQ }));

module.exports = {
  select,
  fSelect,
  composeQuery,
};
