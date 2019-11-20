const { compose } = require('ramda');

const createSql = require('../../_common/sql/index');

const { select, withTransfersDecimalsAndGrouping } = require('./query');
const { filters, filtersOrder } = require('./filters');

const outerSort = s => q => q.clone().orderBy('txs.uid', s);

const queryAfterFilters = {
  get: withTransfersDecimalsAndGrouping,
  mget: withTransfersDecimalsAndGrouping,
  search: (q, fValues) =>
    compose(
      outerSort(fValues.sort),
      withTransfersDecimalsAndGrouping
    )(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
