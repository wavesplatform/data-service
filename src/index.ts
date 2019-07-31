import * as Koa from 'koa';
import chalk from 'chalk';
import * as createRequestId from 'koa-requestid';
import * as bodyParser from 'koa-bodyparser';
import * as qs from 'koa-qs';

import { createPgDriver } from './db';
import createEventBus from './eventBus/';
import * as createAndSubscribeLogger from './logger';
import createServices from './services';

import * as injectConfig from './middleware/injectConfig';
import * as injectEventBus from './middleware/injectEventBus';
import * as accessLogMiddleware from './middleware/accessLog';
import * as serializer from './middleware/serializer';
import * as setHeadersMiddleware from './middleware/setHeaders';

import { loadConfig } from './loadConfig';
import router from './endpoints';

const app = new Koa();
qs(app);

const options = loadConfig();

const eventBus = createEventBus();

createAndSubscribeLogger({ options, eventBus });
const requestId = createRequestId({ expose: 'X-Request-Id', header: false });

const pgDriver = createPgDriver(options);

createServices(options)({
  drivers: {
    pg: pgDriver,
  },
  emitEvent: name => o => eventBus.emit(name, o),
}).then(services => {
  app
    .use(bodyParser())
    .use(requestId)
    .use(setHeadersMiddleware)
    .use(injectEventBus(eventBus))
    .use(accessLogMiddleware)
    .use(serializer)
    .use(injectConfig('defaultMatcher', options.matcher.default))
    .use(router(services).routes())
    .listen(options.port);

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line
    console.log(
      chalk.yellow(`App has started on http://localhost:${options.port}/`)
    );
  }
});
