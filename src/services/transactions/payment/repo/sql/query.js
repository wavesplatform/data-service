const pg = require('knex')({ client: 'pg' });

const columnsWithoutRecipient = {
  // common
  uid: 't.uid',
  height: 't.height',
  tx_type: 't.tx_type',
  id: 't.id',
  time_stamp: 't.time_stamp',
  signature: 't.signature',
  proofs: 't.proofs',
  tx_version: 't.tx_version',
  fee: 't.fee',
  status: 't.status',
  sender: 't.sender',
  sender_public_key: 't.sender_public_key',

  // type-specific
  amount: 't.amount',
};

const select = pg({ t: 'txs_2' });

const selectFromFiltered = (s) => (filtered) =>
  pg
    .select(columnsWithoutRecipient)
    .select({ recipient: 't.recipient' })
    .from({
      t: filtered
        .select(columnsWithoutRecipient)
        .select({
          recipient: pg.raw('coalesce(t.recipient_alias, t.recipient_address)'),
        })
        .select({
          rn: pg.raw(`row_number() over (partition by uid order by uid ${s})`),
        }),
    })
    .where('rn', '=', 1);

module.exports = { select, selectFromFiltered };
