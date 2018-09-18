const batchQuery = require('./batchQuery');
const sql = require('./sql');
const create = require('./create');

module.exports = ({ pg }) =>
  create({
    pg,
    sql,
    batchQuery,
  });
