const Router = require('koa-router');

const subrouter = Router();

const candlesSearch = require('./search');

subrouter.get('/rates/:amountAsset/:priceAsset', candlesSearch);

module.exports = subrouter;
