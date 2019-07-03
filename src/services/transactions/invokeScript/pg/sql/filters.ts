import * as knex from '../../../../../utils/db/knex';

import * as commonFilters from '../../../_common/sql/filters';

export default {
  ...commonFilters,
  dapp: knex.where('dapp'),
  function: knex.where('function_name'),
};
