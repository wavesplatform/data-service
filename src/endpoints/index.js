const Router = require('koa-router');
const router = new Router();

const version = require('./version');
const root = require('./root');
const assets = require('./assets');
const pairs = require('./pairs');
const transactions = require('./transactions');
const aliases = require('./aliases');
const candles = require('./candles');
const balances = require('./balances');
const dataEntries = require('./data-entries');
const stateUpdates = require('./state-updates');

router.use(assets.routes());
router.use(pairs.routes());
router.use(transactions.routes());
router.use(aliases.routes());
router.use(candles.routes());
router.use(balances.routes());
router.use(dataEntries.routes());
router.use(stateUpdates.routes());

router.get('/version', version);
router.get('/', root);
module.exports = router;
