const { path } = require('ramda');
const create = require('../create');

const oneConfig = {
  ...require('./validation/one'),
  transformResult: require('./transformResult/one'),
  dbQuery: path(['aliases', 'one']),
};

const manyConfig = {
  ...require('./validation/many'),
  transformResult: require('./transformResult/many'),
  dbQuery: path(['aliases', 'many']),
};

module.exports = {
  many: create.many(manyConfig),
  one: create.one(oneConfig),
};
