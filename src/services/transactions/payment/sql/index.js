const { compose } = require('ramda');

const createSql = require('../../_common/sql/index');

const { select, withFirstOnly } = require('./query');
const { filters, filtersOrder } = require('./filters');

const queryAfterFilters = {
  get: withFirstOnly,
  mget: withFirstOnly,
  search: (q, fValues) =>
    compose(
      filters.sort(fValues.sort),
      withFirstOnly
    )(q),
};

module.exports = createSql({
  query: select,
  queryAfterFilters,
  filters,
  filtersOrder,
});
