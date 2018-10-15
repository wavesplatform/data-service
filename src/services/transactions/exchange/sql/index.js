const { compose } = require('ramda');

const createSql = require('../../_common/sql/index');

const { select, withDecimals, withOrders, renameFields } = require('./query');
const { filters, filtersOrder } = require('./filters');

const commonQueryAfterFilters = compose(
  withDecimals,
  renameFields,
  withOrders
);

const queryAfterFilters = {
  get: commonQueryAfterFilters,
  mget: commonQueryAfterFilters,
  search: (q, fValues) =>
    compose(
      filters.sortOuter(fValues.sort),
      commonQueryAfterFilters
    )(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
