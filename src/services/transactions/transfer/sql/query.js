const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_4' }).select('*');

const withDecimals = q =>
  pg({ t: q.clone() })
    .select({
      // common
      height: 't.height',
      tx_type: 't.tx_type',
      id: 'txs.id',
      time_stamp: 't.time_stamp',
      signature: 't.signature',
      proofs: 't.proofs',
      tx_version: 't.tx_version',
      fee: pg.raw('t.fee * 10^(-fd.decimals)'),
      sender: 'addrm.address',
      sender_public_key: 'addrm.public_key',

      // type-specific
      asset_id: 'am.asset_id',
      amount: pg.raw('t.amount * 10^(-ad.decimals)'),
      recipient: 'recipient_addrm.address',
      fee_asset: 'fam.asset_id',
      attachment: 't.attachment',
    })
    .leftJoin('txs', 'txs.uid', 't.tuid')
    .leftJoin({ addrm: 'addresses_map' }, 'addrm.uid', 't.sender_uid')
    .leftJoin(
      { recipient_addrm: 'addresses_map' },
      'recipient_addrm.uid',
      't.recipient_uid'
    )
    .leftJoin({ am: 'assets_map' }, 'am.uid', 't.asset_uid')
    .leftJoin({ fam: 'assets_map' }, 'fam.uid', 't.fee_asset_uid')
    .join({ ad: 'txs_3' }, 't.asset_uid', '=', 'ad.asset_uid')
    .join({ fd: 'txs_3' }, 't.fee_asset_uid', '=', 'fd.asset_uid');

module.exports = {
  select,
  withDecimals,
};
