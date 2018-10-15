const { compose } = require('ramda');

const createSql = require('../../_common/sql/index');

const { select, withTransfersDecimalsAndGrouping } = require('./query');
const { filters, filtersOrder } = require('./filters');

const queryAfterFilters = {
  get: withTransfersDecimalsAndGrouping,
  mget: withTransfersDecimalsAndGrouping,
  search: (q, fValues) =>
    compose(
      filters.sort(fValues.sort),
      withTransfersDecimalsAndGrouping
    )(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
