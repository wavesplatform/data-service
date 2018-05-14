const Router = require('koa-router');

const subrouter = new Router();

const candlesOne = require('./candlesOne');
const candlesMany = require('./candlesMany');

subrouter.get('/candles/:id1/:id2', candlesOne);
subrouter.get('/candles', candlesMany);

module.exports = subrouter;
