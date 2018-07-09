const create = require('../create');

const oneConfig = {
  ...require('./validation/one'),
  transformResult: require('./transformResult/one'),
  dbQuery: db => id => db.assets.one(id),
};

const manyConfig = {
  ...require('./validation/many'),
  transformResult: require('./transformResult/many'),
  dbQuery: db => ids => db.assets.many(ids),
};

module.exports = {
  many: create.many(manyConfig),
  one: create.one(oneConfig),
};
