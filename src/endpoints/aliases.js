const Router = require('koa-router');
const { identity } = require('ramda');

const createEndpoint = require('./_common');
const { limit } = require('./_common/filters');
const { parseBool } = require('./utils/parseBool');
const createService = require('../services/aliases');

module.exports = createEndpoint('/aliases', createService, {
  filterParsers: {
    address: identity,
    showBroken: parseBool,
    limit,
  },
})(new Router());
