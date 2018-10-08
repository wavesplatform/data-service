const createSql = require('../../_common/sql/index');

const { select } = require('./query');
const { filters, filtersOrder } = require('./filters');

module.exports = createSql({ query: select, filters, filtersOrder });
