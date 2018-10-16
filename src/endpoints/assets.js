const Router = require('koa-router');

const createEndpoint = require('./_common');

const createService = require('../services/assets');

module.exports = createEndpoint('/assets', createService)(new Router());
