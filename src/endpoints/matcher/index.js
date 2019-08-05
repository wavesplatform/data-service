const Router = require('koa-router');

const subrouter = new Router({ prefix: '/matcher/:matcher' });

const pairs = require('./pairs');
const rates = require('./rates');

module.exports = (pairsService, ratesService) => subrouter
  .use(pairs(pairsService).routes())
  .use(rates(ratesService).routes());
