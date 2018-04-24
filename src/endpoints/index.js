const Router = require('koa-router');
const router = new Router();

const assets = require('./assets');
const asset = require('./asset');

const { RouterError, CustomError } = require('../utils/error');

router.get('/assets', assets);
router.get('/asset/:id', asset);
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
