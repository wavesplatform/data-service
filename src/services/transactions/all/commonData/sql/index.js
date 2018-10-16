const createSql = require('../../../_common/sql');

const { select } = require('./query');

module.exports = createSql({ query: select });
