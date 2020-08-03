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
      fee: pg.raw('txs.fee * 10^(-coalesce(fa.decimals, 8))::double precision'),
      sender: 't.sender',
      sender_public_key: 't.sender_public_key',

      // type-specific
      asset_id: pg.raw(`coalesce(a.asset_id,'WAVES')`),
      amount: pg.raw(
        't.amount * 10^(-coalesce(a.decimals, 8))::double precision'
      ),
      recipient: pg.raw('coalesce(t.recipient_alias, t.recipient_address)'),
      fee_asset: pg.raw("coalesce(fa.asset_id, 'WAVES')"),
      attachment: 't.attachment',
    })
    .from({
      t: filtered.select({
        tx_uid: 't.tx_uid',
        height: 't.height',
        asset_uid: 't.asset_uid',
        attachment: 't.attachment',
        sender: 't.sender',
        sender_public_key: 't.sender_public_key',
        amount: 't.amount',
        recipient_address: 't.recipient_address',
        recipient_alias: 't.recipient_alias',
        fee_asset_uid: 't.fee_asset_uid',
      }),
    })
    .leftJoin('txs', 'txs.uid', 't.tx_uid')
    .leftJoin({ a: 'assets_data' }, 'a.uid', 't.asset_uid')
    .leftJoin({ fa: 'assets_data' }, 'fa.uid', 't.fee_asset_uid');

module.exports = {
  select,
  selectFromFiltered,
};
