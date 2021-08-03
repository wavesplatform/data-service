import * as knex from 'knex';

import * as pointFreeKnex from '../../../../../../utils/db/knex';
import * as commonFilters from '../../../../_common/sql/filters';
import { createByTimeStamp, createByBlockTimeStamp } from '../../../../_common/sql';


const byDapp = (dappAddressOrAlias: string) => (q: knex.QueryBuilder) =>
  q
    .clone()
    .whereRaw(
      `dapp_address = coalesce((select sender from txs_10 where alias = '${dappAddressOrAlias}' limit 1), '${dappAddressOrAlias}')`
    );

const byTimeStamp = createByTimeStamp('txs_16');

const byBlockTimeStamp = createByBlockTimeStamp('txs_16');

export default {
  ...commonFilters,

  dapp: byDapp,
  function: pointFreeKnex.where('function_name'),
  timeStart: byTimeStamp('>='),
  timeEnd: byTimeStamp('<='),
  blockTimeStart: byBlockTimeStamp('>='),
  blockTimeEnd: byBlockTimeStamp('<='),
};
