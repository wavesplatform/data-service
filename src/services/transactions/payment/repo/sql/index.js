const { compose } = require('ramda');

const { createSql } = require('../../../_common/sql');
const { sort } = require('../../../_common/sql/filters');
const { SORT } = require('../../../_common/sql/defaults');

const { select, selectFromFiltered } = require('./query');
const { filters, filtersOrder } = require('./filters');

const queryAfterFilters = {
  // get, mget does not has sort value
  get: selectFromFiltered(SORT),
  mget: selectFromFiltered(SORT),
  search: (q, fValues) =>
    compose(sort(fValues.sort), selectFromFiltered(fValues.sort))(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
