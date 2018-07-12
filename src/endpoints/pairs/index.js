const Router = require('koa-router');

const subrouter = new Router();

const pairsOne = require('./one');
const pairsMany = require('./many');
const postToGet = require('../utils/postToGet');

subrouter.get('/pairs/:id1/:id2', pairsOne);
subrouter.get('/pairs', pairsMany);
subrouter.post('/pairs', postToGet(pairsMany));

module.exports = subrouter;
