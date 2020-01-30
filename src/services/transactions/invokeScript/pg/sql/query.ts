import * as knex from 'knex';
const pg = knex({ client: 'pg' });

const columnsWithoutFeeAndPaymentAssetId = [
  // common
  't.tx_uid',
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

const txs = (qb: knex.QueryBuilder, filteringQ: knex.QueryBuilder) =>
  qb
    .from({ t: 'txs_16' })
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
    .leftJoin('txs_16_args as a', 'a.tx_uid', 't.tx_uid')
    .leftJoin('txs_16_payment as p', 'p.tx_uid', 't.tx_uid')
    .whereIn('t.tx_uid', filteringQ);

export const select = (s: string) =>
  pg
    .select('t.tx_uid')
    .from({ t: 'txs_16' })
    .orderBy('t.tx_uid', s);

export const selectFromFiltered = (filtered: knex.QueryBuilder) =>
  pg
    .with('t_cte', qb => txs(qb, filtered))
    .select(columnsWithoutFeeAndPaymentAssetId)
    .select([
      pg.raw(
        'amount * 10^(case when t.asset_uid is null then -8 else -a.decimals end) as amount'
      ),
      pg.raw('fee * 10^(-8) as fee'),
    ])
    .from({ t: 't_cte' })
    .leftJoin('assets as a', 'a.uid', 't.asset_uid')
    .leftJoin('addresses as addr', 'addr.uid', 't.sender_uid')
    .leftJoin('addresses as daddr', 'daddr.uid', 't.dapp_address_uid')
    .leftJoin('txs', 'txs.uid', 't.tx_uid');
