const pg = require('knex')({ client: 'pg' });

const columns = {
  uid: 't.uid',
  height: 't.height',
  tx_type: 't.tx_type',
  id: 't.id',
  time_stamp: 't.time_stamp',
  signature: 't.signature',
  proofs: 't.proofs',
  tx_version: 't.tx_version',
  fee: pg.raw('t.fee'),
  status: 't.status',
  sender: 't.sender',
  sender_public_key: 't.sender_public_key',
  alias: 't.alias',
};

const select = pg({ t: 'txs_10' });

const selectFromFiltered = (s) => (filtered) =>
  pg
    .select(columns)
    .from({
      t: filtered.select(columns).select({
        rn: pg.raw(`row_number() over (partition by uid order by uid ${s})`),
      }),
    })
    .where('rn', '=', 1);

module.exports = { select, selectFromFiltered };
