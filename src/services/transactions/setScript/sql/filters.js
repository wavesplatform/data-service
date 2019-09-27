const { whereRaw } = require('../../../../utils/db/knex');

const commonFilters = require('../../_common/sql/filters');
const commonFiltersOrder = require('../../_common/sql/filtersOrder');

module.exports = {
  filters: {
    ...commonFilters,
    script: whereRaw('md5(script) = md5(?)'),
  },
  filtersOrder: [...commonFiltersOrder, 'script'],
};
