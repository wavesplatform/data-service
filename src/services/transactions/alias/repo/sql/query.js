const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_10' }).select('*');

const selectFromFiltered = (s) => (filtered) =>
  pg
    .select({
      tx_uid: 't.tx_uid',
      height: 't.height',
      tx_type: 'txs.tx_type',
      id: 'txs.id',
      time_stamp: 'txs.time_stamp',
      signature: 'txs.signature',
      proofs: 'txs.proofs',
      tx_version: 'txs.tx_version',
      fee: pg.raw('txs.fee * 10^(-8)'),
      sender: 't.sender',
      sender_public_key: 't.sender_public_key',
      alias: 't.alias',
    })
    .from({
      t: pg
        .select('*')
        .select({
          rn: pg.raw(
            `row_number() over (partition by tx_uid order by tx_uid ${s})`
          ),
        })
        .from({ t: filtered }),
    })
    .where('rn', '=', 1)
    .leftJoin({ txs: 'txs' }, 'txs.uid', 't.tx_uid');

module.exports = { select, selectFromFiltered };
