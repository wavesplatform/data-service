const { where } = require('../../../../../utils/db/knex');

const { createByTimeStamp, createByBlockTimeStamp } = require('../../../_common/sql');
const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

const byTimeStamp = createByTimeStamp('txs_10');

const byBlockTimeStamp = createByBlockTimeStamp('txs_10');

module.exports = {
  filters: {
    ...commonFilters,

    alias: where('alias'),
    timeStart: byTimeStamp('>='),
    timeEnd: byTimeStamp('<='),
    blockTimeStart: byBlockTimeStamp('>='),
    blockTimeEnd: byBlockTimeStamp('<='),
  },
  filtersOrder: [...commonFiltersOrder, 'timeStart', 'timeEnd', 'alias'],
};
