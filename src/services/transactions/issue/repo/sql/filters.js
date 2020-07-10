const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

module.exports = {
  filters: {
    ...commonFilters,
    
    timeStart: commonFilters.timeStart(3),
    timeEnd: commonFilters.timeEnd(3),
  },
  filtersOrder: [...commonFiltersOrder, 'script', 'assetId'],
};
