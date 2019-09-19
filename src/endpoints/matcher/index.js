const Router = require('koa-router');

const subrouter = new Router({ prefix: '/matcher/:matcher' });

const pairs = require('./pairs');
const rates = require('./rates').default;
const candles = require('./candles').default;

module.exports = (pairsService, candlesService, ratesService) =>
  subrouter
    .use(pairs(pairsService).routes())
    .use(candles(candlesService).routes())
    .use(rates(ratesService).routes());
