const Router = require('koa-router');

const subrouter = new Router();

const exchangeTxs = require('./exchange');

subrouter.get('/transactions/exchange', exchangeTxs);

module.exports = subrouter;
