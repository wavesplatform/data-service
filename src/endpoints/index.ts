import * as Router from 'koa-router';
const router = new Router();

import { ServiceMesh } from '../services';

import * as version from './version';
import * as root from './root';

import * as aliases from './aliases';
import * as assets from './assets';
import * as candles from './candles';
import * as matcher from './matcher';
import * as pairs from './pairs';
import transactions from './transactions';

export default (serviceMesh: ServiceMesh) =>
  router
    .use(aliases(serviceMesh.aliases).routes())
    .use(assets(serviceMesh.assets).routes())
    .use(candles(serviceMesh.candles).routes())
    .use(matcher(serviceMesh.pairs, serviceMesh.rates).routes())
    .use(pairs(serviceMesh.pairs).routes())
    .use(transactions(serviceMesh.transactions).routes())
    .get('/version', version)
    .get('/', root);
