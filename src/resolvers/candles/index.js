const { curryN } = require('ramda');
const create = require('../create');
const validation = require('./validation');
const transformResult = require('./transformResult/');

const curriedEmit = emit => curryN(2, emit);

const manyConfig = {
  ...validation,
  transformResult,
  dbQuery: db => ({ pairs, ...params }) => db.candles(pairs, params),
};

module.exports = ({ db, emitEvent }) =>
  create.many(manyConfig)({ db, emitEvent: curriedEmit(emitEvent) });
