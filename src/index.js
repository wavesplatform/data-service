const Koa = require('koa');
const loadConfig = require('./loadConfig');

const router = require('./endpoints/');
const injectDb = require('./middleware/injectDb');

const PORT = 3000;

const app = new Koa();

app
  .use(injectDb(loadConfig()))
  .use(router.routes())
  .listen(PORT);

console.log(`App has started on http://localhost:${PORT}/`);
