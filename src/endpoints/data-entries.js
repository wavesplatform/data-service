const Router = require('koa-router');
const { identity } = require('ramda');

const createEndpoint = require('./_common');
const { timeStart, intOrNull } = require('./_common/filters');
const { parseBool } = require('./utils/parseBool');
const createService = require('../services/data-entries').default;

module.exports = createEndpoint('/data-entries', createService, {
  filterParsers: {
    address: identity,
    height: intOrNull,
    timestamp: timeStart,
    transaction_id: identity,
    key: identity,
    type: intOrNull,
    binary_value: identity,
    bool_value: x => (typeof x !== 'undefined' ? parseBool(x) : undefined),
    int_value: intOrNull,
    string_value: identity,
  },
})(new Router());
