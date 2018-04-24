const createResolver = require('../createResolver');

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
  many: createResolver(manyConfig)({ db, emitEvent }),
  one: createResolver(oneConfig)({ db, emitEvent }),
});
