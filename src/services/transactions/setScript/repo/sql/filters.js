const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

module.exports = {
  filters: {
    ...commonFilters,

    timeStart: commonFilters.timeStart(13),
    timeEnd: commonFilters.timeEnd(13),
  },
  filtersOrder: [...commonFiltersOrder, 'script'],
};
