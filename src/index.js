const Koa = require('koa');
const chalk = require('chalk');
const cors = require('@koa/cors');

const loadConfig = require('./loadConfig');
const router = require('./endpoints/');
const injectDb = require('./middleware/injectDb');
const inject = require('./middleware/inject');
const requestId = require('koa-requestid');
const createEventBus = require('./eventBus/');
const createLogger = require('./logger');
const subscribeLogger = require('./middleware/loggerSubscription');
const removeErrorBodyProd = require('./middleware/removeErrorBodyProd');
const serializer = require('./middleware/serializer');

const PORT = 3000;

const eventBus = createEventBus();

const app = new Koa();
require('koa-qs')(app);

const options = loadConfig();

app
  .use(removeErrorBodyProd)
  .use(cors())
  .use(serializer)
  .use(requestId())
  .use(inject(['eventBus'], eventBus))
  .use(subscribeLogger(createLogger(options)))
  .use(injectDb(options))
  .use(router.routes())
  .listen(PORT);

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  console.log(chalk.yellow(`App has started on http://localhost:${PORT}/`));
}
