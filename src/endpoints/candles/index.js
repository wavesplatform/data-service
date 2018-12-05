const Router = require('koa-router');

const subrouter = Router();

const candlesSearch = require('./search');

subrouter.get('/candles/:amountAsset/:priceAsset', candlesSearch);

module.exports = subrouter;
