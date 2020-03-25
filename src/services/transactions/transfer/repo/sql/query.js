const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_4' });

const selectFromFiltered = filtered =>
  pg
    .select({
      // common
      tx_uid: 't.tx_uid',
      height: 't.height',
      position_in_block: 't.position_in_block',
      tx_type: 'txs.tx_type',
      id: 'txs.id',
      time_stamp: 'txs.time_stamp',
      signature: 'txs.signature',
      proofs: 'txs.proofs',
      tx_version: 'txs.tx_version',
      fee: pg.raw('txs.fee * 10^(-coalesce(fa.decimals, 8))::double precision'),
      sender: 'addr.address',
      sender_public_key: 'addr.public_key',

      // type-specific
      asset_id: pg.raw(`coalesce(a.asset_id,'WAVES')`),
      amount: pg.raw(
        't.amount * 10^(-coalesce(a.decimals, 8))::double precision'
      ),
      recipient: pg.raw(
        'coalesce(recipient_alias.alias, recipient_addr.address)'
      ),
      fee_asset: pg.raw("coalesce(fa.asset_id, 'WAVES')"),
      attachment: 't.attachment',
    })
    .from({
      t: filtered.select({
        tx_uid: 't.tx_uid',
        height: 't.height',
        position_in_block: 't.position_in_block',
        asset_uid: 't.asset_uid',
        attachment: 't.attachment',
        sender_uid: 't.sender_uid',
        amount: 't.amount',
        recipient_address_uid: 't.recipient_address_uid',
        recipient_alias_uid: 't.recipient_alias_uid',
        fee_asset_uid: 't.fee_asset_uid',
      }),
    })
    .leftJoin('txs', 'txs.uid', 't.tx_uid')
    .leftJoin({ a: 'assets_data' }, 'a.uid', 't.asset_uid')
    .leftJoin({ addr: 'addresses' }, 'addr.uid', 't.sender_uid')
    .leftJoin({ fa: 'assets_data' }, 'fa.uid', 't.fee_asset_uid')
    .leftJoin(
      { recipient_addr: 'addresses' },
      'recipient_addr.uid',
      't.recipient_address_uid'
    )
    .leftJoin(
      { recipient_alias: 'txs_10' },
      'recipient_alias.tx_uid',
      't.recipient_alias_uid'
    );

module.exports = {
  select,
  selectFromFiltered,
};
