import * as knex from 'knex';
const pg = knex({ client: 'pg' });

const columnsWithoutFeeAndPaymentAssetId = [
  // common
  't.height',
  'txs.tx_type',
  'txs.id',
  'txs.time_stamp',
  'txs.signature',
  'txs.proofs',
  'txs.tx_version',
  'addr.address as sender',
  'addr.public_key as sender_public_key',

  // type-specific
  'daddr.address as dapp',
  't.function_name',

  // args
  't.arg_type',
  't.arg_value_integer',
  't.arg_value_boolean',
  't.arg_value_binary',
  't.arg_value_string',
  't.position_in_args',

  // payment
  // payment asset id queries at select function
  'a.asset_id as asset_id',
  't.amount',
  't.position_in_payment',
];

export const txs = (filteringQ: knex.QueryBuilder) =>
  pg({ t: 'txs_16' })
    .select('t.*')
    .select([
      'a.arg_type',
      'a.arg_value_integer',
      'a.arg_value_boolean',
      'a.arg_value_binary',
      'a.arg_value_string',
      'a.position_in_args',
    ])
    .select(['p.asset_uid', 'p.amount', 'p.position_in_payment'])
    .leftJoin({ a: 'txs_16_args' }, 'a.tx_uid', 't.tx_uid')
    .leftJoin({ p: 'txs_16_payment' }, 'p.tx_uid', 't.tx_uid')
    .whereIn('t.tx_uid', filteringQ)
    .orderBy('t.tx_uid', 'desc');

export const blank = (s: string) =>
  pg
    .select('t.tx_uid')
    .from({ t: 'txs_16' })
    .orderBy('t.tx_uid', s);

export const selectOnFiltered = (filtered: knex.QueryBuilder) =>
  pg
    .select(columnsWithoutFeeAndPaymentAssetId)
    .select({
      amount: pg.raw(
        'amount * 10^(case when t.asset_uid is null then -8 else -a.decimals end)'
      ),
    })
    .select({
      fee: pg.raw('fee * 10^(-8)'),
    })
    .from({ t: txs(filtered) })
    .leftJoin({ a: 'assets' }, 'a.uid', 't.asset_uid')
    .leftJoin({ addr: 'addresses' }, 'addr.uid', 't.sender_uid')
    .leftJoin({ daddr: 'addresses' }, 'daddr.uid', 't.dapp_address_uid')
    .leftJoin({ txs: 'txs' }, 'txs.uid', 't.tx_uid')
    .orderBy('t.tx_uid', 'desc');
