const createSql = require('../../../_common/sql');

const { filters } = require('./filters');
const { select } = require('./query');

module.exports = createSql({
  query: select,
  filters,
});
