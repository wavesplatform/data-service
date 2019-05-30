import * as knex from 'knex';
const pg = knex({ client: 'pg' });

const columnsWithoutFee = [
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
  'dapp',
  'function_name',

  // args
  'arg_type',
  'arg_value_integer',
  'arg_value_boolean',
  'arg_value_binary',
  'arg_value_string',
  'position_in_args',

  // payment
  'amount',
  'asset_id',
  'position_in_payment',
];

export const select = pg({ t: 'txs_16' })
  .select(columnsWithoutFee)
  .select({
    fee: pg.raw('fee * 10^(-8)'),
  })
  .leftJoin({ a: 'txs_16_args' }, 'a.tx_id', 't.id')
  .leftJoin({ p: 'txs_16_payment' }, 'p.tx_id', 't.id');

export const fSelect = pg
  .select('id')
  .min({ time_stamp: 'time_stamp' })
  .from('txs_16')
  .leftJoin({ a: 'txs_16_args' }, 'a.tx_id', 't.id')
  .leftJoin({ p: 'txs_16_payment' }, 'p.tx_id', 't.id')
  .groupBy('id');

export const composeQuery = (filteringQ: knex.QueryBuilder) =>
  select.clone().whereIn('id', pg.select('id').from({ filtered: filteringQ }));
