import * as knex from 'knex';
const pg = knex({ client: 'pg' });

const columns = [
  // common
  't.tx_uid',
  't.height',
  'txs.tx_type',
  'txs.id',
  'txs.time_stamp',
  'txs.signature',
  'txs.proofs',
  'txs.tx_version',
  'txs.status',
  'txs.fee',
  't.sender',
  't.sender_public_key',

  // type-specific
  pg.raw('coalesce(t.dapp_alias, t.dapp_address) as dapp'),
  't.function_name',

  // args
  'a.arg_type',
  'a.arg_value_integer',
  'a.arg_value_boolean',
  'a.arg_value_binary',
  'a.arg_value_string',
  'a.arg_value_list',
  'a.position_in_args',

  // payment
  'p.asset_id',
  'p.amount',
  'p.position_in_payment',
];

// in get/mget requests sort is tip for postgresql to use index
export const select = (s: string) =>
  pg({ t: 'txs_16 ' }).orderBy('t.tx_uid', s);

export const selectFromFiltered = (filtered: knex.QueryBuilder) =>
  pg
    .select(columns)
    .from({ t: filtered })
    .leftJoin('txs_16_args as a', 'a.tx_uid', 't.tx_uid')
    .leftJoin('txs_16_payment as p', 'p.tx_uid', 't.tx_uid')
    .leftJoin('txs', 'txs.uid', 't.tx_uid');
