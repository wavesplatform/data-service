const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

module.exports = {
  filters: {
    ...commonFilters,

    timeStart: commonFilters.timeStart(14),
    timeEnd: commonFilters.timeEnd(14),
  },
  filtersOrder: [...commonFiltersOrder, 'assetId'],
};
