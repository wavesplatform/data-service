const { compose } = require('ramda');

const createSql = require('../../_common/sql/index');
const { outerSort } = require('../../_common/filters');

const { select, selectOnFiltered } = require('./query');

const queryAfterFilters = {
  get: selectOnFiltered,
  mget: selectOnFiltered,
  search: (q, fValues) => compose(outerSort(fValues.sort), selectOnFiltered)(q),
};

module.exports = createSql({
  query: select,
  queryAfterFilters,
});
