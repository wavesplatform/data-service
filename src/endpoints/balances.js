const Router = require('koa-router');
const { identity } = require('ramda');

const createEndpoint = require('./_common');
const { timeStart, intOrNull, limit, after } = require('./_common/filters');
const createService = require('../services/balances').default;

module.exports = createEndpoint('/balances', createService, {
  filterParsers: {
    address: identity,
    height: intOrNull,
    timestamp: timeStart,
    transaction_id: identity,
    asset: identity,
    limit,
    after,
  },
})(new Router());
