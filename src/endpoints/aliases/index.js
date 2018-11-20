const Router = require('koa-router');

const subrouter = new Router();

const aliasesOne = require('./one');
const aliasesSearch = require('./search');
const postToGet = require('../utils/postToGet');

subrouter.get('/aliases/:aliasName', aliasesOne);
subrouter.get('/aliases', aliasesSearch);
subrouter.post('/aliases', postToGet(aliasesSearch));

module.exports = subrouter;
