const { compose } = require('ramda');

const createSql = require('../../_common/sql');

const { sort } = require('../../_common/sql/filters');
const { select, withFirstOnly } = require('./query');
const { filters, filtersOrder } = require('./filters');

const queryAfterFilters = {
  get: withFirstOnly,
  mget: withFirstOnly,
  search: (q, fValues) =>
    compose(
      sort(fValues.sort),
      withFirstOnly
    )(q),
};

module.exports = createSql({
  query: select,
  filters,
  filtersOrder,
  queryAfterFilters,
});
