const Router = require('koa-router');

const subrouter = new Router();
const postToGet = require('../utils/postToGet');

subrouter.get('/aliases/:alias', require('./one'));
subrouter.get('/aliases', require('./many'));
subrouter.post('/aliases', postToGet(require('./many')));

module.exports = subrouter;
