const Router = require('koa-router');

const subrouter = new Router();

const exchangeOne = require('./exchange/one');
const exchangeMany = require('./exchange/many');

const dataOne = require('./data/one');
const dataMany = require('./data/many');

const postToGet = require('../utils/postToGet');

subrouter.get('/transactions/exchange/:id', exchangeOne);
subrouter.get('/transactions/exchange', exchangeMany);
subrouter.post('/transactions/exchange', postToGet(exchangeMany));

subrouter.get('/transactions/data/:id', dataOne);
subrouter.get('/transactions/data', dataMany);
subrouter.post('/transactions/data', postToGet(dataMany));

module.exports = subrouter;
