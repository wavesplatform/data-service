const { compose } = require('ramda');

const createSql = require('../../_common/sql/index');
const { outerSort } = require('../../_common/sql/filters');

const { select, selectFromFiltered } = require('./query');
const { filters, filtersOrder } = require('./filters');

const outerLimit = l => q => q.clone().limit(l);

const queryAfterFilters = {
  get: selectFromFiltered,
  mget: selectFromFiltered,
  search: (q, fValues) =>
    compose(
      outerLimit(fValues.limit),
      outerSort(fValues.sort),
      selectFromFiltered
    )(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
