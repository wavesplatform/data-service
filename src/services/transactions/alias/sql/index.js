const { compose } = require('ramda');

const createSql = require('../../_common/sql');
const { outerSort } = require('../../_common/sql/filters');

const { blank, selectOnFiltered } = require('./query');
const { filters, filtersOrder } = require('./filters');

const queryAfterFilters = {
  get: selectOnFiltered,
  mget: selectOnFiltered,
  search: (q, fValues) => compose(outerSort(fValues.sort), selectOnFiltered)(q),
};

module.exports = createSql({
  query: blank,
  filters,
  filtersOrder,
  queryAfterFilters,
});
