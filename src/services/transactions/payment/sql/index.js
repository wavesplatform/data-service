const { compose } = require('ramda');

const createSql = require('../../_common/sql/index');

const { select, withFirstOnly } = require('./query');
const { sort } = require('../../_common/sql/filters');

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
  queryAfterFilters,
});
