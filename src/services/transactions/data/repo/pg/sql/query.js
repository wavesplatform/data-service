const pg = require('knex')({ client: 'pg' });

const selectFromFiltered = filtered =>
  pg
    .columns({
      tx_uid: 't.tx_uid',
      tx_type: 'txs.tx_type',
      tx_version: 'txs.tx_version',
      height: 't.height',
      id: 'txs.id',
      signature: 'txs.signature',
      time_stamp: 'txs.time_stamp',
      proofs: 'txs.proofs',
      sender: 't.sender',
      sender_public_key: 't.sender_public_key',

      // data values
      data_key: 'td.data_key',
      data_type: 'td.data_type',
      data_value_integer: 'td.data_value_integer',
      data_value_boolean: 'td.data_value_boolean',
      data_value_string: 'td.data_value_string',
      data_value_binary: 'td.data_value_binary',
      position_in_tx: 'td.position_in_tx',
    })
    .columns({
      fee: pg.raw('fee * 10^(-8)'),
    })
    .from({ t: 'txs_12' })
    .leftJoin({ txs: 'txs' }, 'txs.uid', 't.tx_uid')
    .leftJoin({ td: 'txs_12_data' }, 'td.tx_uid', 't.tx_uid')
    .whereIn('t.tx_uid', filtered);

const select = pg.select('t.tx_uid').from({ t: 'txs_12' });

module.exports = {
  selectFromFiltered,
  select,
};
