const Router = require('koa-router');

const subrouter = new Router();

const exchangeOne = require('./exchange/one');
const exchangeMany = require('./exchange/many');

const dataOne = require('./data/one');
const dataMany = require('./data/many');

subrouter.get('/transactions/exchange/:id', exchangeOne);
subrouter.get('/transactions/exchange', exchangeMany);

if (process.env.API_DATA_TXS_ENABLED) {
  subrouter.get('/transactions/data/:id', dataOne);
  subrouter.get('/transactions/data', dataMany);
}

module.exports = subrouter;
