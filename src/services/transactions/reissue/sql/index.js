const { compose } = require('ramda');
const createSql = require('../../_common/sql/index');

const { select, fSelect } = require('./query');
const { filters, filtersOrder } = require('./filters');

const queryAfterFilters = {
  get: fSelect,
  mget: fSelect,
  search: (q, fValues) =>
    compose(
      filters.sort(fValues.sort),
      fSelect
    )(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
