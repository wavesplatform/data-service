const createSql = require('../../_common/sql/index');

const { select } = require('./query');
const { filters, filtersOrder } = require('./filters');

const queryAfterFilters = {
  search: (q, fValues) => filters.sortOuter(fValues.sort)(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
