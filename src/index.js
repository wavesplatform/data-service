const Koa = require('koa');
const chalk = require('chalk');

const loadConfig = require('./loadConfig');
const router = require('./endpoints/');
const injectDb = require('./middleware/injectDb');
const injectLogger = require('./middleware/logger');

const PORT = 3000;

const app = new Koa();

app
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.logger.log({
        level: 'error',
        message: err.message,
        name: err.name,
      });
    }
  })
  .use(injectLogger)
  .use(injectDb(loadConfig()))
  .use(router.routes())
  .listen(PORT);

// eslint-disable-next-line
console.log(chalk.green(`App has started on http://localhost:${PORT}/`));
