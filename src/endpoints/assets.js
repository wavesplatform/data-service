const Router = require('koa-router');

const createEndpoint = require('./_common');
const { ids } = require('./_common/filters/index');

const createService = require('../services/assets');

module.exports = createEndpoint('/assets', createService, {
  filterParsers: {
    ids,
    ticker: x => x,
  },
})(new Router());
