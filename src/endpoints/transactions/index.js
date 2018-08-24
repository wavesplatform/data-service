const Router = require('koa-router');

const subrouter = new Router();

const exchangeOne = require('./exchange/one');
const exchangeMany = require('./exchange/many');

const dataOne = require('./data/one');
const dataMany = require('./data/many');

const transferOne = require('./transfer/one');
const transferMany = require('./transfer/many');

const massTransferOne = require('./massTransfer/one');
const massTransferSearch = require('./massTransfer/search');

const postToGet = require('../utils/postToGet');

subrouter.get('/transactions/exchange/:id', exchangeOne);
subrouter.get('/transactions/exchange', exchangeMany);
subrouter.post('/transactions/exchange', postToGet(exchangeMany));

subrouter.get('/transactions/data/:id', dataOne);
subrouter.get('/transactions/data', dataMany);
subrouter.post('/transactions/data', postToGet(dataMany));

subrouter.get('/transactions/transfer/:id', transferOne);
subrouter.get('/transactions/transfer', transferMany);
subrouter.post('/transactions/transfer', postToGet(transferMany));

subrouter.get('/transactions/mass-transfer/:id', massTransferOne);
subrouter.get('/transactions/mass-transfer', massTransferSearch);
subrouter.post('/transactions/mass-transfer', postToGet(massTransferSearch));

module.exports = subrouter;
