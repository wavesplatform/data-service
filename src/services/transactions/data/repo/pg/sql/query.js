const pg = require('knex')({ client: 'pg' });

const select = pg.from({ t: 'txs_12' }).select('t.uid');

const selectFromFiltered = (filtered) =>
  pg
    .with('ts', filtered)
    .select({
      uid: 't.uid',
      tx_type: 't.tx_type',
      tx_version: 't.tx_version',
      height: 't.height',
      id: 't.id',
      signature: 't.signature',
      time_stamp: 't.time_stamp',
      proofs: 't.proofs',
      status: 't.status',
      sender: 't.sender',
      sender_public_key: 't.sender_public_key',
      fee: 't.fee',
      
      // data values
      data_key: 'td.data_key',
      data_type: 'td.data_type',
      data_value_integer: 'td.data_value_integer',
      data_value_boolean: 'td.data_value_boolean',
      data_value_string: 'td.data_value_string',
      data_value_binary: 'td.data_value_binary',
      position_in_tx: 'td.position_in_tx',
    })
    .from('ts')
    .join({ t: 'txs_12' }, 'ts.uid', 't.uid')
    .leftJoin({ td: 'txs_12_data' }, 'td.tx_uid', 't.uid');

module.exports = {
  selectFromFiltered,
  select,
};
