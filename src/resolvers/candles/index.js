const create = require('../create');
const validation = require('./validation');
const transformResult = require('./transformResult/');

const manyConfig = {
  ...validation,
  transformResult,
  dbQuery: db => ({ pairs, ...params }) => db.candles(pairs, params),
};

module.exports = create.many(manyConfig);
