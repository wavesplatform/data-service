const { compose } = require('ramda');

const { createSql } = require('../../../_common/sql/index');
const { sort } = require('../../../_common/sql/filters');

const { select, selectFromFiltered } = require('./query');
const { filters, filtersOrder } = require('./filters');

const queryAfterFilters = {
  get: selectFromFiltered,
  mget: selectFromFiltered,
  search: (q, fValues) => compose(sort(fValues.sort), selectFromFiltered)(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
