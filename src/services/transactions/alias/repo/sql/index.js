const { compose, defaultTo } = require('ramda');

const { createSql } = require('../../../_common/sql');
const { sort } = require('../../../_common/sql/filters');
const { SORT } = require('../../../_common/sql/defaults');

const { select, selectFromFiltered } = require('./query');
const { filters, filtersOrder } = require('./filters');

const sortWithDefault = defaultTo(SORT);

const queryAfterFilters = {
  // get, mget does not has sort value
  get: (q, fValues) => selectFromFiltered(sortWithDefault(fValues.sort))(q),
  mget: (q, fValues) => selectFromFiltered(sortWithDefault(fValues.sort))(q),
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
