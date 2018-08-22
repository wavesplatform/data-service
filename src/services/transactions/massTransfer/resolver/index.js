const { identity } = require('ramda');
const create = require('../../../../resolvers/create');

const oneConfig = {
  ...require('./validation/one'),
  transformResult: require('./transformResult/one'),
  dbQuery: identity,
};

const searchConfig = {
  ...require('./validation/many'),
  transformInput: require('./transformInput'),
  transformResult: require('./transformResult/many'),
  dbQuery: identity,
};

module.exports = {
  one: ({ getData, emitEvent }) =>
    create.one(oneConfig)({ db: getData, emitEvent }),
  search: ({ getData, emitEvent }) =>
    create.many(searchConfig)({ db: getData, emitEvent }),
};
