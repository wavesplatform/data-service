const createSql = require('../../../_common/sql');

const { filters } = require('./filters');
const { blank } = require('./query');

module.exports = createSql({
  query: blank,
  filters,
});
