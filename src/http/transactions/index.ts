import * as Router from 'koa-router';

import { ServiceMesh } from '../../services';

import commonParsers from '../_common/filters/parsers';
import { Parser } from '../_common/filters/types';

import {
  createTransactionHttpHandlers,
  parseGet,
  parseMgetOrSearch,
} from './_common';

import { parseDataMgetOrSearch } from './parseDataMgetOrSearch';

const createParseRequest = <SearchRequest>(
  customParsers: Record<string, Parser<any>> = {}
) => ({
  get: parseGet,
  mgetOrSearch: parseMgetOrSearch<SearchRequest>(customParsers),
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
      assetId: commonParsers.query,
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
      matcher: commonParsers.query,
      amountAsset: commonParsers.query,
      priceAsset: commonParsers.query,
      orderId: commonParsers.query,
    })
  );

  const genesis = createTransactionHttpHandlers(
    new Router(),
    '/transactions/genesis',
    txsServices['genesis'],
    createParseRequest({
      recipient: commonParsers.query,
    })
  );

  const invokeScript = createTransactionHttpHandlers(
    new Router(),
    '/transactions/invoke-script',
    txsServices['invokeScript'],
    createParseRequest({
      dapp: commonParsers.query,
      function: commonParsers.query,
    })
  );

  const issue = createTransactionHttpHandlers(
    new Router(),
    '/transactions/issue',
    txsServices['issue'],
    createParseRequest({
      assetId: commonParsers.query,
      script: commonParsers.query,
    })
  );

  const lease = createTransactionHttpHandlers(
    new Router(),
    '/transactions/lease',
    txsServices['lease'],
    createParseRequest({
      recipient: commonParsers.query,
    })
  );

  const leaseCancel = createTransactionHttpHandlers(
    new Router(),
    '/transactions/lease-cancel',
    txsServices['leaseCancel'],
    createParseRequest({
      recipient: commonParsers.query,
    })
  );

  const massTransfer = createTransactionHttpHandlers(
    new Router(),
    '/transactions/mass-transfer',
    txsServices['massTransfer'],
    createParseRequest({
      assetId: commonParsers.query,
      recipient: commonParsers.query,
    })
  );

  const payment = createTransactionHttpHandlers(
    new Router(),
    '/transactions/payment',
    txsServices['payment'],
    createParseRequest({
      recipient: commonParsers.query,
    })
  );

  const reissue = createTransactionHttpHandlers(
    new Router(),
    '/transactions/reissue',
    txsServices['reissue'],
    createParseRequest({
      assetId: commonParsers.query,
    })
  );

  const setAssetScript = createTransactionHttpHandlers(
    new Router(),
    '/transactions/set-asset-script',
    txsServices['setAssetScript'],
    createParseRequest({
      assetId: commonParsers.query,
      script: commonParsers.query,
    })
  );

  const setScript = createTransactionHttpHandlers(
    new Router(),
    '/transactions/set-script',
    txsServices['setScript'],
    createParseRequest({
      script: commonParsers.query,
    })
  );

  const sponsorship = createTransactionHttpHandlers(
    new Router(),
    '/transactions/sponsorship',
    txsServices['sponsorship'],
    createParseRequest({
      assetId: commonParsers.query,
    })
  );

  const transfer = createTransactionHttpHandlers(
    new Router(),
    '/transactions/transfer',
    txsServices['transfer'],
    createParseRequest({
      assetId: commonParsers.query,
      recipient: commonParsers.query,
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
