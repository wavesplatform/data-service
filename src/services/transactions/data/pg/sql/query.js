const pg = require('knex')({ client: 'pg' });

const select = pg
  .columns([
    'tx_type',
    'tx_version',
    'height',
    'id',
    'signature',
    'time_stamp',
    'proofs',
    'status',
    'sender',
    'sender_public_key',

    // data values
    'tx_id',
    'data_key',
    'data_type',
    'data_value_integer',
    'data_value_boolean',
    'data_value_string',
    'data_value_binary',
    'position_in_tx',
  ])
  .columns({
    fee: pg.raw('fee * 10^(-8)'),
  })
  .select()
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
