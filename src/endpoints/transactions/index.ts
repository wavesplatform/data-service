import { compose, identity, toPairs, reduce, omit } from 'ramda';
import * as Router from 'koa-router';

import { ServiceMesh } from '../../services';

import * as createEndpoint from '../_common';
import {
  timeStart,
  timeEnd,
  after,
  limit,
  ids,
  sort,
  query,
} from '../_common/filters';

// filters
const commonTxFilters = {
  ids,
  timeStart,
  timeEnd,
  limit,
  after,
  sort,
  sender: identity,
};

// common options
const createOptions = (specificFilters?: { [key: string]: any }) => ({
  filterParsers: { ...commonTxFilters, ...specificFilters },
});

const transactionsEndpointsConfig = (
  services: ServiceMesh['transactions']
): { [url: string]: TxServiceParams } => ({
  '/transactions/all': {
    service: services.allTxs,
    options: createOptions(),
  },
  '/transactions/genesis': {
    service: services.genesisTxs,
    options: { filterParsers: omit(['sender'], commonTxFilters) },
  },
  '/transactions/payment': {
    service: services.paymentTxs,
    options: createOptions(),
  },
  '/transactions/issue': {
    service: services.issueTxs,
    options: createOptions({
      assetId: identity,
      script: identity,
    }),
  },
  '/transactions/transfer': {
    service: services.transferTxs,
    options: createOptions({
      assetId: identity,
      recipient: identity,
    }),
  },
  '/transactions/reissue': {
    service: services.reissueTxs,
    options: createOptions({
      assetId: identity,
    }),
  },
  '/transactions/burn': {
    service: services.burnTxs,
    options: createOptions({
      assetId: identity,
    }),
  },
  '/transactions/exchange': {
    service: services.exchangeTxs,
    options: createOptions({
      matcher: identity,
      amountAsset: identity,
      priceAsset: identity,
      orderId: query,
      orderSender: query,
    }),
  },
  '/transactions/lease': {
    service: services.leaseTxs,
    options: createOptions({ recipient: identity }),
  },
  '/transactions/lease-cancel': {
    service: services.leaseCancelTxs,
    options: createOptions({ recipient: identity }),
  },
  '/transactions/alias': {
    service: services.aliasTxs,
    options: createOptions(),
  },
  '/transactions/mass-transfer': {
    service: services.massTransferTxs,
    options: createOptions({
      assetId: identity,
      recipient: identity,
    }),
  },
  '/transactions/data': {
    service: services.dataTxs,
    options: { parseFiltersFn: require('./parseDataTxFilters') },
  },
  '/transactions/set-script': {
    service: services.setScriptTxs,
    options: createOptions({ script: identity }),
  },
  '/transactions/sponsorship': {
    service: services.sponsorshopTxs,
    options: createOptions(),
  },
  '/transactions/set-asset-script': {
    service: services.setAssetScriptTxs,
    options: createOptions({ assetId: identity, script: identity }),
  },
  '/transactions/invoke-script': {
    service: services.invokeScriptTxs,
    options: createOptions({ dapp: identity, function: identity }),
  },
});

type TxServiceParams = {
  service: any;
  options: TxServiceOptions;
};

type TxServiceOptions = {
  filterParsers?: any;
  parseFiltersFn?: any;
  mgetFilterName?: any;
};

export default (txsServices: ServiceMesh['transactions']) =>
  compose<
    { [url: string]: TxServiceParams },
    [string, TxServiceParams][],
    Router<any, any>
  >(
    reduce(
      (acc, [url, { service, options }]) =>
        createEndpoint(url, service, options)(acc),
      new Router()
    ),
    toPairs
  )(transactionsEndpointsConfig(txsServices));
