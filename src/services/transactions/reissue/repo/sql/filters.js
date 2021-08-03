const { createByTimeStamp, createByBlockTimeStamp } = require('../../../_common/sql');
const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

const byTimeStamp = createByTimeStamp('txs_5');

const byBlockTimeStamp = createByBlockTimeStamp('txs_5');

module.exports = {
  filters: {
    ...commonFilters,

    timeStart: byTimeStamp('>='),
    timeEnd: byTimeStamp('<='),
    blockTimeStart: byBlockTimeStamp('>='),
    blockTimeEnd: byBlockTimeStamp('<='),
  },
  filtersOrder: [...commonFiltersOrder, 'timeStart', 'timeEnd', 'assetId'],
};
