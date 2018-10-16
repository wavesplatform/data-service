const createSql = require('../../_common/sql/index');

const { select } = require('./query');

module.exports = createSql({ query: select });
