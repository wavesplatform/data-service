const Router = require('koa-router');
const { identity } = require('ramda');

const createEndpoint = require('./_common');
const { timeStart } = require('./_common/filters');
const { parseBool } = require('./utils/parseBool');
const createService = require('../services/data-entries').default;

module.exports = createEndpoint('/data-entries', createService, {
  filterParsers: {
    address: identity,
    height: x => parseInt(x) || undefined,
    timestamp: timeStart,
    transaction_id: identity,
    key: identity,
    type: x => parseInt(x) || undefined,
    binary_value: identity,
    bool_value: x => (x ? parseBool(x) : undefined),
    int_value: x => parseInt(x) || undefined,
    string_value: identity,
  },
})(new Router());
