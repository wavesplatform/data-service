const pg = require('knex')({ client: 'pg' });

const columnsWithoutSatoshi = [
  // common
  'height',
  'tx_type',
  'id',
  'time_stamp',
  'signature',
  'proofs',
  'tx_version',
  // 'fee',
  'sender',
  'sender_public_key',

  // type-specific
  'recipient',
  // satoshi
];

const select = pg({ t: 'txs_2' })
  .select(columnsWithoutSatoshi)
  .select({
    fee: pg.raw('fee * 10^(-8)'),
    amount: pg.raw('amount * 10^(-8)'),
  });

const withFirstOnly = q =>
  pg
    .select([...columnsWithoutSatoshi, 'fee', 'amount'])
    .from({
      counted: pg
        .select('*')
        .select({
          rn: pg.raw(
            'row_number() over (partition by id order by time_stamp asc)'
          ),
        })
        .from({ t: q.clone() }),
    })
    .where('rn', '=', 1);

module.exports = { select, withFirstOnly };
