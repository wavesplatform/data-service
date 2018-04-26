const { curryN } = require('ramda');
const createResolver = require('../createResolver');

const curriedEmit = emit => curryN(2, emit);
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

module.exports = {
  many: ({ db, emitEvent }) =>
    createResolver(manyConfig)({ db, emitEvent: curriedEmit(emitEvent) }),
  one: ({ db, emitEvent }) =>
    createResolver(oneConfig)({ db, emitEvent: curriedEmit(emitEvent) }),
};
