const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

module.exports = {
  filters: {
    ...commonFilters,

    timeStart: commonFilters.timeStart(15),
    timeEnd: commonFilters.timeEnd(15),
  },
  filtersOrder: [...commonFiltersOrder, 'assetId', 'script'],
};
