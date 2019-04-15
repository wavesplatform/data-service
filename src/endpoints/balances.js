const Router = require('koa-router');
const { identity } = require('ramda');

const createEndpoint = require('./_common');
const { timeStart } = require('./_common/filters');
const createService = require('../services/balances').default;

module.exports = createEndpoint('/balances', createService, {
  filterParsers: {
    address: identity,
    asset_id: identity,
    height: x => parseInt(x) || undefined,
    timestamp: timeStart,
    transaction_id: identity,
  },
})(new Router());
