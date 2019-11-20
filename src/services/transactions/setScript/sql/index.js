const { compose } = require('ramda');

const createSql = require('../../_common/sql/index');

const { select, fSelect } = require('./query');
const { filters, filtersOrder } = require('./filters');

const outerSort = s => q => q.clone().orderBy('txs.uid', s);

const queryAfterFilters = {
  get: fSelect,
  mget: fSelect,
  search: (q, fValues) =>
    compose(
      outerSort(fValues.sort),
      fSelect
    )(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
