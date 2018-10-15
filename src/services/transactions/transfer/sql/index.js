const { compose } = require('ramda');

const createSql = require('../../_common/sql/index');

const { select, withDecimals } = require('./query');
const { filters, filtersOrder } = require('./filters');

const queryAfterFilters = {
  get: withDecimals,
  mget: withDecimals,
  search: (q, fValues) =>
    compose(
      filters.sort(fValues.sort),
      withDecimals
    )(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
