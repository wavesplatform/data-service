const { compose } = require('ramda');

const createSql = require('../../_common/sql/index');

const { select, withFirstOnly } = require('./query');

const outerSort = s => q => q.clone().orderBy('txs.uid', s);

const queryAfterFilters = {
  get: withFirstOnly,
  mget: withFirstOnly,
  search: (q, fValues) => compose(outerSort(fValues.sort), withFirstOnly)(q),
};

module.exports = createSql({
  query: select,
  queryAfterFilters,
});
