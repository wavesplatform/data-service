const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_11' })
  .leftJoin({ tfs: 'txs_11_transfers' }, 'tfs.tx_uid', '=', 't.uid')
  .select('t.uid');

const selectFromFiltered = (filtered) =>
  pg
    .with('ts', filtered)
    .select({
      uid: 't.uid',
      id: 't.id',
      fee: 't.fee',
      height: 't.height',
      tx_type: 't.tx_type',
      time_stamp: 't.time_stamp',
      signature: 't.signature',
      proofs: 't.proofs',
      tx_version: 't.tx_version',
      status: 't.status',
      sender: 't.sender',
      sender_public_key: 't.sender_public_key',
      asset_id: 't.asset_id',
      attachment: 't.attachment',
      recipient_alias: 'tfs.recipient_alias',
      recipient_address: 'tfs.recipient_address',
      amount: 'tfs.amount',
      position_in_tx: 'tfs.position_in_tx',
    })
    .from('ts')
    .join({ t: 'txs_11 ' }, 'ts.uid', 't.uid')
    .leftJoin({ tfs: 'txs_11_transfers' }, 'tfs.tx_uid', '=', 't.uid');

module.exports = {
  select,
  selectFromFiltered,
};
