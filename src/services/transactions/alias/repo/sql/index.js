const { compose } = require('ramda');

const { createSql } = require('../../../_common/sql');
const { sort } = require('../../../_common/sql/filters');
const { SORT } = require('../../../_common/sql/defaults');

const { select, selectFromFiltered } = require('./query');
const { filters, filtersOrder } = require('./filters');

const queryAfterFilters = {
  get: selectFromFiltered(SORT),
  mget: selectFromFiltered(SORT),
  search: (q, fValues) =>
    compose(
      // outer sort
      sort(fValues.sort),
      // inner sort for row_number() subquery
      selectFromFiltered(fValues.sort)
    )(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
