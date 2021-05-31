import * as knex from 'knex';
import * as pointFreeKnex from '../../../../../../utils/db/knex';
import * as commonFilters from '../../../../_common/sql/filters';
const pg = knex({ client: 'pg' });


const byDapp = (dappAddressOrAlias: string) => (q: knex.QueryBuilder) =>
  q
    .clone()
    .whereRaw(
      `dapp_address = coalesce((select sender from txs_10 where alias = '${dappAddressOrAlias}' limit 1), '${dappAddressOrAlias}')`
    );

const byTimeStamp = (comparator: string) => (ts: Date) => (q: knex.QueryBuilder) =>
  q
    .clone()
    .where(
      't.uid',
      comparator,
      pg('txs_16')
        .select('uid')
        .where('time_stamp', comparator, ts.toISOString())
        .orderByRaw(`time_stamp <-> '${ts.toISOString()}'::timestamptz`)
        .limit(1)
    );

export default {
  ...commonFilters,

  dapp: byDapp,
  function: pointFreeKnex.where('function_name'),
  timeStart: byTimeStamp('>='),
  timeEnd: byTimeStamp('<='),
};
