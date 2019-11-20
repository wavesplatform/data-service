import * as knex from 'knex';
import * as pointFreeKnex from '../../../../../utils/db/knex';

import * as commonFilters from '../../../_common/sql/filters';

export default {
  ...commonFilters,
  sort: (s: string) => (q: knex.QueryBuilder) => q.clone().orderBy('t.uid', s),
  dapp: pointFreeKnex.where('dapp'),
  function: pointFreeKnex.where('function_name'),
};
