const { createByTimeStamp, createByBlockTimeStamp } = require('../../../_common/sql');
const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

const byTimeStamp = createByTimeStamp('txs_4');

const byBlockTimeStamp = createByBlockTimeStamp('txs_4');

module.exports = {
  filters: {
    ...commonFilters,

    timeStart: byTimeStamp('>='),
    timeEnd: byTimeStamp('<='),
    blockTimeStart: byBlockTimeStamp('>='),
    blockTimeEnd: byBlockTimeStamp('<='),
  },
  filtersOrder: [...commonFiltersOrder, 'timeStart', 'timeEnd', 'assetId', 'recipient'],
};
