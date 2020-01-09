import * as Router from 'koa-router';
const router = new Router();

import { ServiceMesh } from '../services';

import version from './version';
import root from './root';

import aliases from './aliases';
import assets from './assets';
import notFound from './notFound';
import candles from './candles';
import matchers from './matchers';
import pairs from './pairs';
import transactions from './transactions';

export default (serviceMesh: ServiceMesh) =>
  router
    .use(aliases(serviceMesh.aliases).routes())
    .use(assets(serviceMesh.assets).routes())
    .use(candles(serviceMesh.candles).routes())
    .use(matchers(serviceMesh.matchers).routes())
    .use(pairs(serviceMesh.pairs).routes())
    .use(transactions(serviceMesh.transactions).routes())
    .get('/version', version)
    .get('/', root)
    .get('*', notFound);
