const pg = require('knex')({ client: 'pg' });
const { pipe } = require('ramda');

const select = pg({ t: 'txs_11' });

const withTransfers = (q) =>
  q.clone().leftJoin({ tfs: 'txs_11_transfers' }, 'tfs.tx_uid', '=', 't.uid');

const withGrouping = (q) =>
  q
    .clone()
    .groupBy(
      't.id',
      't.fee',
      't.height',
      't.tx_type',
      't.time_stamp',
      't.signature',
      't.proofs',
      't.tx_version',
      't.status',
      't.sender',
      't.sender_public_key',
      't.asset_id',
      't.attachment',
      't.uid',
      't.uid'
    );

const selectFromFiltered = pipe(
  (filtered) =>
    filtered.select({
      uid: 't.uid',
      id: 't.id',
      fee: 't.fee',
      recipients: pg.raw(
        'array_agg(coalesce(tfs.recipient_alias, tfs.recipient_address) order by tfs.position_in_tx)'
      ),
      amounts: pg.raw('array_agg(tfs.amount  order by tfs.position_in_tx)'),
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
    }),
  withTransfers,
  withGrouping
);

module.exports = {
  select,
  selectFromFiltered,
};
