const Router = require('koa-router');

const subrouter = new Router();

const pairsOne = require('./one');
const pairsMany = require('./many');

subrouter.get('/pairs/:id1/:id2', pairsOne);
subrouter.get('/pairs', pairsMany);

module.exports = subrouter;
