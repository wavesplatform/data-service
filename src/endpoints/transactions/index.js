const Router = require('koa-router');

const subrouter = new Router();

const exchangeOne = require('./exchangeOne');
const exchangeMany = require('./exchangeMany');

subrouter.get('/transactions/exchange/:id', exchangeOne);
subrouter.get('/transactions/exchange', exchangeMany);

module.exports = subrouter;
