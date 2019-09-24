const Router = require('koa-router');

const subrouter = new Router({ prefix: '/matchers/:matcher' });

const createPairs = require('./pairs');
const createCandles = require('./candles').default;
const createRates = require('./rates').default;

module.exports = ({ pairs, candles, rates }) =>
  subrouter
    .use(createPairs(pairs).routes())
    .use(createCandles(candles).routes())
    .use(createRates(rates).routes());
