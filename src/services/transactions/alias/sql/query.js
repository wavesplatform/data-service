const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_10' }).select('*');

const withFirstOnly = q =>
  pg
    .select({
      height: 't.height',
      tx_type: 't.tx_type',
      id: 'txs.id',
      time_stamp: 't.time_stamp',
      signature: 't.signature',
      proofs: 't.proofs',
      tx_version: 't.tx_version',
      fee: pg.raw('t.fee * 10^(-8)'),
      sender: 'addrm.address',
      sender_public_key: 'addrm.public_key',
      alias: 't.alias',
    })
    .from({
      t: pg
        .select('*')
        .select({
          rn: pg.raw('row_number() over (partition by tuid order by tuid asc)'),
        })
        .from({ t: q.clone() }),
    })
    .where('rn', '=', 1)
    .leftJoin({ txs: 'txs' }, 'txs.uid', 't.tuid')
    .leftJoin({ addrm: 'addresses_map' }, 'addrm.uid', 't.sender_uid');

module.exports = { select, withFirstOnly };
