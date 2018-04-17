const Koa = require('koa');
const app = new Koa();
const router = require('./endpoints/');

const PORT = 3000;

app.use(router.routes());
app.listen(PORT);

console.log(`
App has started on http://localhost:${PORT}/
`);
