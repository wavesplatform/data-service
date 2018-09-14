const createPgAdapter = require('./pg');
module.exports = ({ drivers }) => createPgAdapter(drivers);
