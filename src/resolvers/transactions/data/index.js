const create = require('../../create');

const oneConfig = {
  ...require('./validation/one'),
  transformResult: require('./transformResult/one'),
  dbQuery: db => id => db.transactions.data.one(id),
};

const manyConfig = {
  ...require('./validation/many'),
  transformResult: require('./transformResult/many'),
  transformInput: require('./transformInput'),
  dbQuery: db => filters => db.transactions.data.many(filters),
};

module.exports = {
  one: create.one(oneConfig),
  many: create.many(manyConfig),
};
