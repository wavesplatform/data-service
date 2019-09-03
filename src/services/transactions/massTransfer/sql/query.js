const pg = require('knex')({ client: 'pg' });
const { pipe } = require('ramda');

const selectIdsWhereRecipient = recipient =>
  pg('txs_11_transfers')
    .select('tuid')
    .where('recipient_uid', function() {
      this.select('uid')
        .from('addresses_map')
        .where('address', recipient);
    });

const select = pg({ t: 'txs_11' });

const withTransfers = q =>
  q
    .clone()
    .join({ tfs: 'txs_11_transfers' }, 'tfs.tuid', '=', 't.tuid')
    .leftJoin(
      { recipient_addrm: 'addresses_map' },
      'recipient_addrm.uid',
      'tfs.recipient_uid'
    );

const withGrouping = q =>
  q
    .clone()
    .groupBy(
      't.tuid',
      'txs.id',
      't.fee',
      't.height',
      't.tx_type',
      't.time_stamp',
      't.signature',
      't.proofs',
      't.tx_version',
      'addrm.address',
      'addrm.public_key',
      'am.asset_id',
      't.attachment'
    );

const withTransfersDecimalsAndGrouping = pipe(
  q => pg({ t: q }),
  withTransfers,
  withGrouping,
  q =>
    q
      .select({
        id: 'txs.id',
        fee: pg.raw('(t.fee * 10^(-8)) :: DOUBLE PRECISION'),
        recipients: pg.raw(
          'array_agg(recipient_addrm.address order by tfs.position_in_tx)'
        ),
        amounts: pg.raw(
          'array_agg (tfs.amount * 10^(-coalesce(ad.decimals, 8)) :: double precision order by tfs.position_in_tx)'
        ),
        height: 't.height',
        tx_type: 't.tx_type',
        time_stamp: 't.time_stamp',
        signature: 't.signature',
        proofs: 't.proofs',
        tx_version: 't.tx_version',
        sender: 'addrm.address',
        sender_public_key: 'addrm.public_key',
        asset_id: 'am.asset_id',
        attachment: 't.attachment',
      })
      .leftJoin('txs', 'txs.uid', 't.tuid')
      .leftJoin({ addrm: 'addresses_map' }, 'addrm.uid', 't.sender_uid')
      .leftJoin({ am: 'assets_map' }, 'am.uid', 't.asset_uid')
      .leftJoin({ ad: 'txs_3' }, 'ad.asset_uid', '=', 't.asset_uid')
);
module.exports = {
  select,
  withTransfersDecimalsAndGrouping,
  selectIdsWhereRecipient,
};
