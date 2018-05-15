const Router = require('koa-router');

const subrouter = new Router();

const assetsMany = require('./assetsMany');
const assetsOne = require('./assetsOne');

subrouter.get('/assets', assetsMany);
subrouter.get('/assets/:id', assetsOne);

module.exports = subrouter;