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
import { Serializable, Service } from '../../types';

import { parseFilters as parseDataTxFilters } from './parseDataTxFilters';

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
// @todo make types better
const createOptions = (
  specificFilters?: Record<string, (param: string) => any>
) => ({
  filterParsers: { ...commonTxFilters, ...specificFilters },
});

const transactionsEndpointsConfig = (
  services: ServiceMesh['transactions']
): { [url: string]: EndpointDependencies } => ({
  '/transactions/all': {
    service: services.all,
    options: createOptions(),
  },
  '/transactions/genesis': {
    service: services.genesis,
    options: {
      filterParsers: omit(['sender'], {
        ...commonTxFilters,
        recipient: identity,
      }),
    },
  },
  '/transactions/payment': {
    service: services.payment,
    options: createOptions({
      recipient: identity,
    }),
  },
  '/transactions/issue': {
    service: services.issue,
    options: createOptions({
      assetId: identity,
      script: identity,
    }),
  },
  '/transactions/transfer': {
    service: services.transfer,
    options: createOptions({
      assetId: identity,
      recipient: identity,
    }),
  },
  '/transactions/reissue': {
    service: services.reissue,
    options: createOptions({
      assetId: identity,
    }),
  },
  '/transactions/burn': {
    service: services.burn,
    options: createOptions({
      assetId: identity,
    }),
  },
  '/transactions/exchange': {
    service: services.exchange,
    options: createOptions({
      matcher: identity,
      amountAsset: identity,
      priceAsset: identity,
      orderId: query,
    }),
  },
  '/transactions/lease': {
    service: services.lease,
    options: createOptions({ recipient: identity }),
  },
  '/transactions/lease-cancel': {
    service: services.leaseCancel,
    options: createOptions({ recipient: identity }),
  },
  '/transactions/alias': {
    service: services.alias,
    options: createOptions(),
  },
  '/transactions/mass-transfer': {
    service: services.massTransfer,
    options: createOptions({
      assetId: identity,
      recipient: identity,
    }),
  },
  '/transactions/data': {
    service: services.data,
    options: { parseFiltersFn: parseDataTxFilters },
  },
  '/transactions/set-script': {
    service: services.setScript,
    options: createOptions({ script: identity }),
  },
  '/transactions/sponsorship': {
    service: services.sponsorship,
    options: createOptions({
      assetId: identity,
    }),
  },
  '/transactions/set-asset-script': {
    service: services.setAssetScript,
    options: createOptions({ assetId: identity, script: identity }),
  },
  '/transactions/invoke-script': {
    service: services.invokeScript,
    options: createOptions({ dapp: identity, function: identity }),
  },
});

type EndpointDependencies = {
  service: Service<any, any, any, Serializable<string, any>>;
  options: EndpointOptions;
};

type EndpointOptions = {
  filterParsers?: any; // { [param: string]: (param: string) => any }, but { ids: (strOrArr: any) => any } does not assign (ids does not assign)
  parseFiltersFn?: (query: any) => Record<string, any>;
  mgetFilterName?: string;
};

export default (txsServices: ServiceMesh['transactions']) =>
  compose<
    Record<string, EndpointDependencies>,
    [string, EndpointDependencies][],
    Router<any, any>
  >(
    reduce(
      (acc, [url, { service, options }]) =>
        createEndpoint(url, service, options)(acc),
      new Router()
    ),
    toPairs
  )(transactionsEndpointsConfig(txsServices));
