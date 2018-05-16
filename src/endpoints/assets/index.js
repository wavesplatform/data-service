const Router = require('koa-router');

const subrouter = new Router();

const assetsMany = require('./many');
const assetsOne = require('./one');

subrouter.get('/assets', assetsMany);
subrouter.get('/assets/:id', assetsOne);

module.exports = subrouter;
