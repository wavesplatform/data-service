const pg = require('knex')({ client: 'pg' });
const { pipe } = require('ramda');

const select = pg({ t: 'txs_11' });

const withTransfers = (q) =>
  q
    .clone()
    .leftJoin({ tfs: 'txs_11_transfers' }, 'tfs.tx_uid', '=', 't.tx_uid');

const withGrouping = (q) =>
  q
    .clone()
    .groupBy(
      'txs.id',
      'txs.fee',
      't.height',
      'txs.tx_type',
      'txs.time_stamp',
      'txs.signature',
      'txs.proofs',
      'txs.tx_version',
      't.sender',
      't.sender_public_key',
      't.asset_id',
      't.attachment',
      't.tx_uid',
      'txs.uid'
    );

const selectFromFiltered = pipe(
  (filtered) =>
    pg
      .select({
        tx_uid: 't.tx_uid',
        id: 'txs.id',
        fee: pg.raw('(txs.fee * 10^(-8)) :: DOUBLE PRECISION'),
        recipients: pg.raw('array_agg(t.recipient order by t.position_in_tx)'),
        amounts: pg.raw('array_agg(t.amount  order by t.position_in_tx)'),
        height: 't.height',
        tx_type: 'txs.tx_type',
        time_stamp: 'txs.time_stamp',
        signature: 'txs.signature',
        proofs: 'txs.proofs',
        tx_version: 'txs.tx_version',
        sender: 't.sender',
        sender_public_key: 't.sender_public_key',
        asset_id: 't.asset_id',
        attachment: 't.attachment',
      })
      .from({
        t: withTransfers(pg({ t: filtered }))
          .select({
            tx_uid: 't.tx_uid',
            height: 't.height',
            sender: 't.sender',
            sender_public_key: 't.sender_public_key',
            asset_id: pg.raw(`coalesce(a.asset_id,'WAVES')`),
            attachment: 't.attachment',
            amount: pg.raw(
              'tfs.amount * 10^(-coalesce(a.decimals, 8))::double precision'
            ),
            position_in_tx: 'tfs.position_in_tx',
            recipient: pg.raw('coalesce(tfs.recipient_address, tfs.recipient_alias)'),
          })
          .leftJoin({ a: 'assets_data' }, 'a.uid', 't.asset_uid'),
      })
      .leftJoin('txs', 'txs.uid', 't.tx_uid'),
  withGrouping
);

module.exports = {
  select,
  selectFromFiltered,
};
