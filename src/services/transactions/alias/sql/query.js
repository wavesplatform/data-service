const pg = require('knex')({ client: 'pg' });

const columnsWithoutFee = [
  // common
  'height',
  'tx_type',
  'id',
  'time_stamp',
  'signature',
  'proofs',
  'tx_version',
  'status',
  // 'fee',
  'sender',
  'sender_public_key',
  // type-specific
  'alias',
];

const select = pg({ t: 'txs_10' })
  .select(columnsWithoutFee)
  .select({
    fee: pg.raw('fee * 10^(-8)'),
  });

const withFirstOnly = q =>
  pg
    .select([...columnsWithoutFee, 'fee'])
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
