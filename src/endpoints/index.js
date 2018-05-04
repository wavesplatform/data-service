const Router = require('koa-router');
const router = new Router();

const assetsMany = require('./assetsMany');
const assetsOne = require('./assetsOne');
const version = require('./version');

router.get('/assets', assetsMany);
router.get('/assets/:id', assetsOne);
router.get('/version', version);
module.exports = router;
