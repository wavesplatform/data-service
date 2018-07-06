const { curryN, identity } = require('ramda');
const create = require('../../../resolvers/create');

const curriedEmit = emit => curryN(2, emit);

const oneConfig = {
  ...require('./validation/one'),
  transformResult: require('./transformResult/one'),
  dbQuery: identity,
};

const manyConfig = {
  ...require('./validation/many'),
  transformResult: require('./transformResult/many'),
  dbQuery: identity,
};

module.exports = {
  many: ({ getData, emitEvent }) =>
    create.many(manyConfig)({ db: getData, emitEvent: curriedEmit(emitEvent) }),
  one: ({ getData, emitEvent }) =>
    create.one(oneConfig)({ db: getData, emitEvent: curriedEmit(emitEvent) }),
};
