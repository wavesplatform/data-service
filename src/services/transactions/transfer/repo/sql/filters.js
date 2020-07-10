const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

module.exports = {
  filters: {
    ...commonFilters,

    timeStart: commonFilters.timeStart(4),
    timeEnd: commonFilters.timeEnd(4),
  },
  filtersOrder: [...commonFiltersOrder, 'assetId', 'recipient'],
};
