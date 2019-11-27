const { compose } = require('ramda');

const createSql = require('../../_common/sql/index');

const { select, selectFromFiltered } = require('./query');
const { filters, filtersOrder } = require('./filters');

const queryAfterFilters = {
  get: selectFromFiltered,
  mget: selectFromFiltered,
  search: (q, fValues) =>
    compose(filters.sortOuter(fValues.sort), selectFromFiltered)(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
