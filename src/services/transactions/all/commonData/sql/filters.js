const { without, omit } = require('ramda');

const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

module.exports = {
  filters: omit(['senders'], commonFilters),

  filtersOrder: without(['senders'], commonFiltersOrder),
};
