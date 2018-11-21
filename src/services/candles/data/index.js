const create = require('./create');
const sql = require('./sql');

module.exports = ({ pg }) => 
  create({ pg, sql });
