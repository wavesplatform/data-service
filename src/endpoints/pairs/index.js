const Router = require('koa-router');

const subrouter = new Router();

const pairsOne = require('./one');
const pairsMany = require('./many');
const postToGet = require('../utils/postToGet');

module.exports = pairsService =>
  subrouter
    .get('/pairs/:id1/:id2', pairsOne(pairsService))
    .get('/pairs', pairsMany(pairsService))
    .post('/pairs', postToGet(pairsMany(pairsService)));
