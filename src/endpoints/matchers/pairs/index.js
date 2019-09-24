const Router = require('koa-router');

const subrouter = new Router();

const postToGet = require('../../utils/postToGet');
const pairsOne = require('./one');
const pairsMany = require('./many');

module.exports = pairsService =>
  subrouter
    .get('/pairs/:amountAsset/:priceAsset', pairsOne(pairsService))
    .get('/pairs', pairsMany(pairsService))
    .post('/pairs', postToGet(pairsMany(pairsService)));
