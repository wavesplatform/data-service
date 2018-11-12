const Router = require('koa-router');

const createEndpoint = require('./_common');

const createService = require('../services/aliases');

module.exports = createEndpoint('/aliases', createService)(new Router());
