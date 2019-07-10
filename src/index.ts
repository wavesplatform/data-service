import * as Koa from 'koa';
import chalk from 'chalk';

import { loadConfig } from './loadConfig';
import * as router from './endpoints/';
import * as injectDb from './middleware/injectDb';
import * as injectConfig from './middleware/injectConfig';
import * as injectEventBus from './middleware/injectEventBus';
import * as accessLogMiddleware from './middleware/accessLog';
import createEventBus from './eventBus/';
import * as createAndSubscribeLogger from './logger';
import * as removeErrorBodyProd from './middleware/removeErrorBodyProd';
import * as injectCache from './middleware/injectCache';
import * as serializer from './middleware/serializer';
import * as setHeadersMiddleware from './middleware/setHeaders';

import { loadMatcherSettings } from './loadMatcherSettings';
import * as injectOrderPair from './middleware/injectOrderPair';

import * as createRequestId from 'koa-requestid';
import * as bodyParser from 'koa-bodyparser';
import * as qs from 'koa-qs';

const eventBus = createEventBus();

const app = new Koa();
qs(app);

const options = loadConfig();
createAndSubscribeLogger({ options, eventBus });
const requestId = createRequestId({ expose: 'X-Request-Id', header: false });

loadMatcherSettings().then(settings => {
  app
    .use(removeErrorBodyProd)
    .use(bodyParser())
    .use(requestId)
    .use(setHeadersMiddleware)
    .use(injectEventBus(eventBus))
    .use(accessLogMiddleware)
    .use(serializer)
    .use(injectDb(options))
    .use(injectConfig('defaultMatcher', options.defaultMatcher))
    .use(injectOrderPair(settings.priceAssets))
    .use(injectCache)
    .use(router.routes())
    .listen(options.port);

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line
    console.log(
      chalk.yellow(`App has started on http://localhost:${options.port}/`)
    );
  }
});
