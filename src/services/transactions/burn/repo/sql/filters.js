const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

module.exports = {
  filters: {
    ...commonFilters,
    
    timeStart: commonFilters.timeStart(6),
    timeEnd: commonFilters.timeEnd(6),
  },
  filtersOrder: [...commonFiltersOrder, 'assetId'],
};
