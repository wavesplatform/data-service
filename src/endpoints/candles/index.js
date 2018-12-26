const Router = require('koa-router');

const subrouter = Router();

const candlesSearch = require('./search');

subrouter.get('/candles/:amountAsset/:priceAsset', candlesSearch);
subrouter.get('/candles/:amountAsset', candlesSearch);

module.exports = subrouter;
