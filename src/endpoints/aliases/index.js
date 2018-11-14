const Router = require('koa-router');

const subrouter = new Router();

const aliasesOne = require('./one');
const aliasesMany = require('./many');
const postToGet = require('../utils/postToGet');

subrouter.get('/aliases/:aliasName', aliasesOne);
subrouter.get('/aliases', aliasesMany);
subrouter.post('/aliases', postToGet(aliasesMany));

module.exports = subrouter;
