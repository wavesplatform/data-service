const Router = require('koa-router');

const subrouter = new Router();

const exchangeOne = require('./exchange/one');
// const exchangeMany = require('./exchange/many');

subrouter.get('/transactions/exchange/:id', exchangeOne);
// subrouter.get('/transactions/exchange', exchangeMany);

module.exports = subrouter;
