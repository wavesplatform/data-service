import * as Router from 'koa-router';

import { ServiceMesh } from '../../services';

import commonFilters from '../_common/filters/filters';
import { Parser } from '../_common/filters/types';

import {
  createTransactionHttpHandlers,
  parseGet,
  parseMgetOrSearch,
} from './_common';
import { parseDataMgetOrSearch } from './parseDataMgetOrSearch';

const createParseRequest = <SearchRequest>(
  customFilters: Record<string, Parser<any>> = {}
) => ({
  get: parseGet,
  mgetOrSearch: parseMgetOrSearch<SearchRequest>(customFilters),
});

const subrouter = new Router();

export default (txsServices: ServiceMesh['transactions']) => {
  const all = createTransactionHttpHandlers(
    new Router(),
    '/transactions/all',
    txsServices['all'],
    createParseRequest()
  );

  const alias = createTransactionHttpHandlers(
    new Router(),
    '/transactions/alias',
    txsServices['alias'],
    createParseRequest()
  );

  const burn = createTransactionHttpHandlers(
    new Router(),
    '/transactions/burn',
    txsServices['burn'],
    createParseRequest({
      assetId: commonFilters.query,
    })
  );

  const data = createTransactionHttpHandlers(
    new Router(),
    '/transactions/data',
    txsServices['data'],
    {
      get: parseGet,
      mgetOrSearch: parseDataMgetOrSearch,
    }
  );

  const exchange = createTransactionHttpHandlers(
    new Router(),
    '/transactions/exchange',
    txsServices['exchange'],
    createParseRequest({
      matcher: commonFilters.query,
      amountAsset: commonFilters.query,
      priceAsset: commonFilters.query,
      orderId: commonFilters.query,
    })
  );

  const genesis = createTransactionHttpHandlers(
    new Router(),
    '/transactions/genesis',
    txsServices['genesis'],
    createParseRequest({
      recipient: commonFilters.query,
    })
  );

  const invokeScript = createTransactionHttpHandlers(
    new Router(),
    '/transactions/invoke-script',
    txsServices['invokeScript'],
    createParseRequest({
      dapp: commonFilters.query,
      function: commonFilters.query,
    })
  );

  const issue = createTransactionHttpHandlers(
    new Router(),
    '/transactions/issue',
    txsServices['issue'],
    createParseRequest({
      assetId: commonFilters.query,
      script: commonFilters.query,
    })
  );

  const lease = createTransactionHttpHandlers(
    new Router(),
    '/transactions/lease',
    txsServices['lease'],
    createParseRequest({
      recipient: commonFilters.query,
    })
  );

  const leaseCancel = createTransactionHttpHandlers(
    new Router(),
    '/transactions/lease-cancel',
    txsServices['leaseCancel'],
    createParseRequest({
      recipient: commonFilters.query,
    })
  );

  const massTransfer = createTransactionHttpHandlers(
    new Router(),
    '/transactions/mass-transfer',
    txsServices['massTransfer'],
    createParseRequest({
      assetId: commonFilters.query,
      recipient: commonFilters.query,
    })
  );

  const payment = createTransactionHttpHandlers(
    new Router(),
    '/transactions/payment',
    txsServices['payment'],
    createParseRequest({
      recipient: commonFilters.query,
    })
  );

  const reissue = createTransactionHttpHandlers(
    new Router(),
    '/transactions/reissue',
    txsServices['reissue'],
    createParseRequest({
      assetId: commonFilters.query,
    })
  );

  const setAssetScript = createTransactionHttpHandlers(
    new Router(),
    '/transactions/set-asset-script',
    txsServices['setAssetScript'],
    createParseRequest({
      assetId: commonFilters.query,
      script: commonFilters.query,
    })
  );

  const setScript = createTransactionHttpHandlers(
    new Router(),
    '/transactions/set-script',
    txsServices['setScript'],
    createParseRequest({
      script: commonFilters.query,
    })
  );

  const sponsorship = createTransactionHttpHandlers(
    new Router(),
    '/transactions/sponsorship',
    txsServices['sponsorship'],
    createParseRequest({
      assetId: commonFilters.query,
    })
  );

  const transfer = createTransactionHttpHandlers(
    new Router(),
    '/transactions/transfer',
    txsServices['transfer'],
    createParseRequest({
      assetId: commonFilters.query,
      recipient: commonFilters.query,
    })
  );

  return subrouter.use(
    alias.routes(),
    all.routes(),
    burn.routes(),
    data.routes(),
    exchange.routes(),
    genesis.routes(),
    invokeScript.routes(),
    issue.routes(),
    lease.routes(),
    leaseCancel.routes(),
    massTransfer.routes(),
    payment.routes(),
    reissue.routes(),
    setAssetScript.routes(),
    setScript.routes(),
    sponsorship.routes(),
    transfer.routes()
  );
};
