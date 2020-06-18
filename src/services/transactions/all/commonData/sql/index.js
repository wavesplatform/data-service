const createSql = require('../../../_common/sql');

const { select } = require('./query');
const { filters, filtersOrder } = require('./filters')

module.exports = createSql({
  query: select,
  filters,
  filtersOrder
});
