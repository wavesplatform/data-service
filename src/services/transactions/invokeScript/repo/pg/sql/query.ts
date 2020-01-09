import * as knex from 'knex';
const pg = knex({ client: 'pg' });

const columnsWithoutFeeAndPaymentAssetId = [
  // common
  'height',
  'tx_type',
  'id',
  'time_stamp',
  'signature',
  'proofs',
  'tx_version',
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
  // payment asset id queries at select function
  'amount',
  'position_in_payment',
];

export const txs = pg({ t: 'txs_16' })
  .select('*')
  .leftJoin({ a: 'txs_16_args' }, 'a.tx_id', 't.id')
  .leftJoin({ p: 'txs_16_payment' }, 'p.tx_id', 't.id');

export const fSelect = pg.select('id').from('txs_16');

export const select = pg
  .select(columnsWithoutFeeAndPaymentAssetId)
  .select({
    amount: pg.raw(
      'amount * 10^(case when txs.asset_id is null then -8 else -p_dec.decimals end)'
    ),
    asset_id: 'txs.asset_id',
  })
  .select({
    fee: pg.raw('fee * 10^(-8)'),
  })
  .from({ txs })
  .leftJoin({ p_dec: 'asset_decimals' }, 'p_dec.asset_id', 'txs.asset_id');

export const composeQuery = (
  filteringQ: knex.QueryBuilder
): knex.QueryBuilder =>
  select.clone().whereIn('id', pg.select('id').from({ filtered: filteringQ }));
