import * as pointFreeKnex from '../../../../../../utils/db/knex';

import * as commonFilters from '../../../../_common/sql/filters';

const byDapp = (dappAddress: string) =>
  pointFreeKnex.where('dapp_address',  dappAddress);

export default {
  ...commonFilters,
  
  dapp: byDapp,
  function: pointFreeKnex.where('function_name'),
};
