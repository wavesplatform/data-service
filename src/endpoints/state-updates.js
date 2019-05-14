const Router = require('koa-router');

const createEndpoint = require('./_common');
const createService = require('../services/state-updates').default;

module.exports = createEndpoint('/state-updates', createService)(new Router());
