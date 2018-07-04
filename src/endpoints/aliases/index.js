const Router = require('koa-router');

const subrouter = new Router();

subrouter.get('/aliases/:alias', require('./one'));
subrouter.get('/aliases', require('./many'));

module.exports = subrouter;
