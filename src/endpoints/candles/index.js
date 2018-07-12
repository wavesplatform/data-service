const Router = require('koa-router');

const subrouter = new Router();

const candlesOne = require('./one');
const candlesMany = require('./many');
const postToGet = require('../utils/postToGet');

subrouter.get('/candles/:id1/:id2', candlesOne);
subrouter.get('/candles', candlesMany);
subrouter.post('/candles', postToGet(candlesMany));

module.exports = subrouter;
