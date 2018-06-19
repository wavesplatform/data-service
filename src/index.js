const Koa = require('koa');
const chalk = require('chalk');

const loadConfig = require('./loadConfig');
const router = require('./endpoints/');
const injectDb = require('./middleware/injectDb');
const injectEventBus = require('./middleware/injectEventBus');
const accessLogMiddleware = require('./middleware/accessLog');
const requestId = require('koa-requestid');
const createEventBus = require('./eventBus/');
const createAndSubscribeLogger = require('./logger');
const removeErrorBodyProd = require('./middleware/removeErrorBodyProd');
const serializer = require('./middleware/serializer');
const setHeadersMiddleware = require('./middleware/setHeaders');

const eventBus = createEventBus();

const app = new Koa();
require('koa-qs')(app);

const options = loadConfig();
createAndSubscribeLogger({ options, eventBus });

app
  .use(removeErrorBodyProd)
  .use(setHeadersMiddleware)
  .use(requestId())
  .use(injectEventBus(eventBus))
  .use(accessLogMiddleware)
  .use(serializer)
  .use(injectDb(options))
  .use(router.routes())
  .listen(options.port);

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  console.log(chalk.yellow(`App has started on http://localhost:${options.port}/`));
}
