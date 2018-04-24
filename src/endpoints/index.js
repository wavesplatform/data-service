const Router = require('koa-router');
const router = new Router();

const assetsMany = require('./assetsMany');
const assetsOne = require('./assetsOne');

const { RouterError, CustomError } = require('../utils/error');

router.get('/assets', assetsMany);
router.get('/assets/:id', assetsOne);
router.get('/endpoint-error', ctx => {
  ctx.throw(500, new RouterError(ctx));
});
router.get('/custom-error', ctx => {
  ctx.throw(500, new CustomError('custom messagee'));
});
router.get('/default-error', ctx => {
  ctx.throw(500, new Error('custom messagee'));
});

module.exports = router;
