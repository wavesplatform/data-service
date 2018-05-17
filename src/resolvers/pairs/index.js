const { curryN } = require('ramda');
const create = require('../create');

const curriedEmit = emit => curryN(2, emit);

const oneConfig = {
  ...require('./validation/one'),
  transformResult: require('./transformResult/one'),
  dbQuery: db => id => db.pairs.one(id),
};

const manyConfig = {
  ...require('./validation/many'),
  transformResult: require('./transformResult/many'),
  dbQuery: db => ids => db.pairs.many(ids),
};

module.exports = {
  many: ({ db, emitEvent }) =>
    create.many(manyConfig)({ db, emitEvent: curriedEmit(emitEvent) }),
  one: ({ db, emitEvent }) =>
    create.one(oneConfig)({ db, emitEvent: curriedEmit(emitEvent) }),
};
