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
      'txs.status',
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
        fee: 'txs.fee',
        recipients: pg.raw('array_agg(t.recipient order by t.position_in_tx)'),
        amounts: pg.raw('array_agg(t.amount  order by t.position_in_tx)'),
        height: 't.height',
        tx_type: 'txs.tx_type',
        time_stamp: 'txs.time_stamp',
        signature: 'txs.signature',
        proofs: 'txs.proofs',
        tx_version: 'txs.tx_version',
        status: 'txs.status',
        sender: 't.sender',
        sender_public_key: 't.sender_public_key',
        asset_id: 't.asset_id',
        attachment: 't.attachment',
      })
      .from({
        t: withTransfers(pg({ t: filtered })).select({
          tx_uid: 't.tx_uid',
          height: 't.height',
          sender: 't.sender',
          sender_public_key: 't.sender_public_key',
          asset_id: `t.asset_id`,
          attachment: 't.attachment',
          amount: 'tfs.amount',
          position_in_tx: 'tfs.position_in_tx',
          recipient: pg.raw(
            'coalesce(tfs.recipient_alias, tfs.recipient_address)'
          ),
        }),
      })
      .leftJoin('txs', 'txs.uid', 't.tx_uid'),
  withGrouping
);

module.exports = {
  select,
  selectFromFiltered,
};
