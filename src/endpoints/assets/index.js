const Router = require('koa-router');

const subrouter = new Router();

const assetsMany = require('./many');
const assetsOne = require('./one');
const postToGet = require('../utils/postToGet');

subrouter.get('/assets', assetsMany);
subrouter.post('/assets', postToGet(assetsMany));

subrouter.get('/assets/:id', assetsOne);

module.exports = subrouter;
