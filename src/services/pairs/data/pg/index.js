const createPgAdapter = require('./adapter');
const sql = require('./sql');

module.exports = ({ pg }) => createPgAdapter({ pg, sql });
