const Koa = require('koa');
const app = new Koa();
const router = require('./endpoints/');
const api = require('./mocks/api');
const PORT = 3000;

app.use(async (ctx, next) => {
  ctx.api = api;
  await next();
});
app.use(router.routes());
app.listen(PORT);

console.log(`
App has started on http://localhost:${PORT}/
`);
