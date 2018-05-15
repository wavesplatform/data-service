const Router = require('koa-router');
const router = new Router();

const version = require('./version');
const assets = require('./assets');
const transactions = require('./transactions');

router.use(assets.routes());
router.use(transactions.routes());

router.get('/version', version);
module.exports = router;
