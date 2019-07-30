const Router = require('koa-router');
const { identity } = require('ramda');

const createEndpoint = require('./_common');
const { parseBool } = require('./utils/parseBool');

module.exports = createEndpoint('/aliases', 'aliases', {
  filterParsers: {
    address: identity,
    showBroken: parseBool,
  },
})(new Router());
