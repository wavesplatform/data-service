const create = require('../create');

const oneConfig = {
  ...require('./validation/one'),
  transformResult: require('./transformResult/one'),
  dbQuery: db => id => db.assets([id]),
};

const manyConfig = {
  ...require('./validation/many'),
  transformResult: require('./transformResult/many'),
  dbQuery: db => ids => db.assets(ids),
};

module.exports = ({ db, emitEvent }) => ({
  many: create.many(manyConfig)({ db, emitEvent }),
  one: create.one(oneConfig)({ db, emitEvent }),
});
