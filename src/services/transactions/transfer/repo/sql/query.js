const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_4' });

const selectFromFiltered = (filtered) =>
  pg
    .select({
      // common
      tx_uid: 't.tx_uid',
      height: 't.height',
      tx_type: 'txs.tx_type',
      id: 'txs.id',
      time_stamp: 'txs.time_stamp',
      signature: 'txs.signature',
      proofs: 'txs.proofs',
      tx_version: 'txs.tx_version',
      fee: 'txs.fee',
      status: 'txs.status',
      sender: 't.sender',
      sender_public_key: 't.sender_public_key',

      // type-specific
      asset_id: 't.asset_id',
      amount: 't.amount',
      recipient: pg.raw('coalesce(t.recipient_alias, t.recipient_address)'),
      fee_asset: 't.fee_asset_id',
      attachment: 't.attachment',
    })
    .from({
      t: filtered.select({
        tx_uid: 't.tx_uid',
        height: 't.height',
        asset_id: 't.asset_id',
        attachment: 't.attachment',
        sender: 't.sender',
        sender_public_key: 't.sender_public_key',
        amount: 't.amount',
        recipient_address: 't.recipient_address',
        recipient_alias: 't.recipient_alias',
        fee_asset_id: 't.fee_asset_id',
      }),
    })
    .leftJoin('txs', 'txs.uid', 't.tx_uid');

module.exports = {
  select,
  selectFromFiltered,
};
