const { compose } = require('ramda');

const { createApi } = require('./api');
const { select, selectFromFiltered } = require('./query');
const { filters, filtersOrder } = require('./filters');

const queryAfterFilters = {
  get: selectFromFiltered,
  mget: selectFromFiltered,
  search: (q, fValues) =>
    compose(filters.outerSort(fValues.sort), selectFromFiltered)(q),
};

module.exports = createApi({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
