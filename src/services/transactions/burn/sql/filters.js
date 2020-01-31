const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

module.exports = {
  filters: commonFilters,
  filtersOrder: [...commonFiltersOrder, 'assetId'],
};
