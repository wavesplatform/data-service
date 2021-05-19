import * as Koa from 'koa';
import chalk from 'chalk';
import * as createRequestId from 'koa-requestid';
import * as bodyParser from 'koa-bodyparser';
import { unsafeKoaQs } from './utils/koaQs';

import { createPgDriver } from './db';
import createEventBus from './eventBus/';
import * as createAndSubscribeLogger from './logger';
import createServices from './services';

import * as injectConfig from './middleware/injectConfig';
import * as injectEventBus from './middleware/injectEventBus';
import * as accessLogMiddleware from './middleware/accessLog';

const cors = require('@koa/cors');

import { loadConfig } from './loadConfig';
import router from './http';

export const WavesId: string = 'WAVES';

const app = unsafeKoaQs(new Koa());

const options = loadConfig();

const eventBus = createEventBus();

createAndSubscribeLogger({ options, eventBus });
const requestId = createRequestId({ expose: 'X-Request-Id', header: false });

// @todo add the test sql query for the db availability checking
const pgDriver = createPgDriver(options);

createServices({
  options,
  pgDriver,
  emitEvent: (name) => (o) => eventBus.emit(name, o),
})
  .map((services) =>
    app
      .use(bodyParser())
      .use(requestId)
      .use(cors())
      .use(injectEventBus(eventBus))
      .use(accessLogMiddleware)
      .use(
        injectConfig('defaultMatcher', options.matcher.defaultMatcherAddress)
      )
      .use(router(services).routes())
  )
  .run()
  .listen({
    onResolved: (app) => {
      app.listen(options.port);

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line
        console.log(
          chalk.yellow(`App has started on http://localhost:${options.port}/`)
        );
      }
    },
    onRejected: (e) => {
      console.error(e);
    },
  });
