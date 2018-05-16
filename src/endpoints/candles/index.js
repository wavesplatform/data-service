const Router = require('koa-router');

const subrouter = new Router();

const candlesOne = require('./one');
const candlesMany = require('./many');

subrouter.get('/candles/:id1/:id2', candlesOne);
subrouter.get('/candles', candlesMany);

module.exports = subrouter;
