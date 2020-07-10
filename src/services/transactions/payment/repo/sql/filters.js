const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

module.exports = {
  filters: {
    ...commonFilters,
    
    timeStart: commonFilters.timeStart(2),
    timeEnd: commonFilters.timeEnd(2),
  },
  filtersOrder: [...commonFiltersOrder, 'recipient'],
};
