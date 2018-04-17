const Router = require('koa-router');
const router = new Router();
const assets = require('./assets');
const { RouterError, CustomError } = require('../utils/error');

router.get('/assets/:ids', assets);
router.get('/endpoint-error', ctx => {
  ctx.throw(new RouterError(ctx));
});
router.get('/custom-error', ctx => {
  ctx.throw(new CustomError('custom messagee'));
});
router.get('/default-error', ctx => {
  ctx.throw(new Error('custom messagee'));
});

module.exports = router;
