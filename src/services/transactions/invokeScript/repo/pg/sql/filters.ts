import * as knex from 'knex';
import * as pointFreeKnex from '../../../../../../utils/db/knex';

import * as commonFilters from '../../../../_common/sql/filters';

const byDapp = (dappAddress: string) =>
  // usage of whereIn proofed by performance reasons 
  // union with `function` filter in this case works faster (or with some another filter)
  pointFreeKnex.whereIn('dapp_address_uid', function(this: knex.QueryBuilder) {
    this.select('uid')
      .from('addresses')
      .where('address', dappAddress)
      .limit(1);
  });

export default {
  ...commonFilters,
  sort: (s: string) => (q: knex.QueryBuilder) => q.clone().orderBy('t.uid', s),
  dapp: byDapp,
  function: pointFreeKnex.where('function_name'),
};
