const createResolver = require('../createResolver');
const { curryN } = require('ramda');
const curriedEmit = emit => curryN(2, emit);

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
  many: createResolver(manyConfig)({ db, emitEvent: curriedEmit(emitEvent) }),
  one: createResolver(oneConfig)({ db, emitEvent: curriedEmit(emitEvent) }),
});
