const createSql = require('../../_common/sql/index');

const { select, fSelect } = require('./query');

const queryAfterFilters = {
  get: fSelect,
  mget: fSelect,
  search: fSelect,
};

module.exports = createSql({ query: select, queryAfterFilters });
