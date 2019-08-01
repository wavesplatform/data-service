const Router = require('koa-router');

const subrouter = new Router({ prefix: '/matcher/:matcher' });

const pairs = require('./pairs');

module.exports = pairsService => subrouter.use(pairs(pairsService).routes());
