const Router = require('koa-router');
const router = new Router();

const version = require('./version');
const root = require('./root');
const assets = require('./assets');
const pairs = require('./pairs');
const transactions = require('./transactions');
const aliases = require('./aliases');
// const candles = require('./candles');

router.use(assets.routes());
router.use(pairs.routes());
router.use(transactions.routes());
router.use(aliases.routes());
// router.use(candles.routes());

router.get('/version', version);
router.get('/', root);
module.exports = router;
