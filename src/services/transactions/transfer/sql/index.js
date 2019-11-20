const { compose } = require('ramda');

const createSql = require('../../_common/sql/index');

const { select, withDecimals } = require('./query');
const { filters, filtersOrder } = require('./filters');

const outerSort = s => q => q.clone().orderBy('txs.uid', s);

const queryAfterFilters = {
  get: withDecimals,
  mget: withDecimals,
  search: (q, fValues) =>
    compose(
      outerSort(fValues.sort),
      withDecimals
    )(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
