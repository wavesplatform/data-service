const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_4' });

const selectFromFiltered = (filtered) =>
  filtered.select({
    // common
    uid: 't.uid',
    height: 't.height',
    tx_type: 't.tx_type',
    id: 't.id',
    time_stamp: 't.time_stamp',
    signature: 't.signature',
    proofs: 't.proofs',
    tx_version: 't.tx_version',
    fee: 't.fee',
    status: 't.status',
    sender: 't.sender',
    sender_public_key: 't.sender_public_key',

    // type-specific
    asset_id: 't.asset_id',
    amount: 't.amount',
    recipient: pg.raw('coalesce(t.recipient_alias, t.recipient_address)'),
    fee_asset: 't.fee_asset_id',
    attachment: 't.attachment',
  });
module.exports = {
  select,
  selectFromFiltered,
};
