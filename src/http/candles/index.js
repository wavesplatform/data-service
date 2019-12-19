const Router = require('koa-router');

const subrouter = Router();

const candlesSearch = require('./search');

module.exports = candlesService =>
  subrouter
    .get('/candles/:amountAsset/:priceAsset', candlesSearch(candlesService))
    .get('/candles/:amountAsset', candlesSearch(candlesService));
