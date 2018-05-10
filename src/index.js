const Koa = require('koa');
const chalk = require('chalk');
const cors = require('@koa/cors');

const loadConfig = require('./loadConfig');
const router = require('./endpoints/');
const injectDb = require('./middleware/injectDb');
const injectEventBus = require('./middleware/injectEventBus');
const accessLogMiddleware = require('./middleware/accessLog');
const requestId = require('koa-requestid');
const createEventBus = require('./eventBus/');
const createAndSubscribeLogger = require('./logger');
const serializer = require('./middleware/serializer');

const PORT = 3000;

const eventBus = createEventBus();

const app = new Koa();
require('koa-qs')(app);

const options = loadConfig();
createAndSubscribeLogger({ options, eventBus });

app
  .use(cors())
  .use(requestId())
  .use(injectEventBus(eventBus))
  .use(accessLogMiddleware)
  .use(serializer)
  .use(injectDb(options))
  .use(router.routes())
  .listen(PORT);

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  console.log(chalk.yellow(`App has started on http://localhost:${PORT}/`));
}
