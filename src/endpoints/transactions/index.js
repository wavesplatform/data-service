const { compose, identity, toPairs, reduce, omit } = require('ramda');

const Router = require('koa-router');

const createEndpoint = require('../_common');
const {
  timeStart,
  timeEnd,
  after,
  limit,
  ids,
  sort,
  query,
} = require('../_common/filters');

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
const createOptions = specificFilters => ({
  filterParsers: { ...commonTxFilters, ...specificFilters },
});

const transactionsEndpointsConfig = {
  '/transactions/all': {
    service: 'allTxs',
    options: createOptions(),
  },
  '/transactions/genesis': {
    service: 'genesisTxs',
    options: { filterParsers: omit(['sender'], commonTxFilters) },
  },
  '/transactions/payment': {
    service: 'paymentTxs',
    options: createOptions(),
  },
  '/transactions/issue': {
    service: 'issueTxs',
    options: createOptions({
      assetId: identity,
      script: identity,
    }),
  },
  '/transactions/transfer': {
    service: 'transferTxs',
    options: createOptions({
      assetId: identity,
      recipient: identity,
    }),
  },
  '/transactions/reissue': {
    service: 'reissueTxs',
    options: createOptions({
      assetId: identity,
    }),
  },
  '/transactions/burn': {
    service: 'burnTxs',
    options: createOptions({
      assetId: identity,
    }),
  },
  '/transactions/exchange': {
    service: 'exchangeTxs',
    options: createOptions({
      matcher: identity,
      amountAsset: identity,
      priceAsset: identity,
      orderId: query,
      orderSender: query,
    }),
  },
  '/transactions/lease': {
    service: 'leaseTxs',
    options: createOptions({ recipient: identity }),
  },
  '/transactions/lease-cancel': {
    service: 'leaseCancelTxs',
    options: createOptions({ recipient: identity }),
  },
  '/transactions/alias': {
    service: 'aliasTxs',
    options: createOptions(),
  },
  '/transactions/mass-transfer': {
    service: 'massTransferTxs',
    options: createOptions({
      assetId: identity,
      recipient: identity,
    }),
  },
  '/transactions/data': {
    service: 'dataTxs',
    options: { parseFiltersFn: require('./parseDataTxFilters') },
  },
  '/transactions/set-script': {
    service: 'setScriptTxs',
    options: createOptions({ script: identity }),
  },
  '/transactions/sponsorship': {
    service: 'sponsorshipTxs',
    options: createOptions(),
  },
  '/transactions/set-asset-script': {
    service: 'setAssetScriptTxs',
    options: createOptions({ assetId: identity, script: identity }),
  },
  '/transactions/invoke-script': {
    service: 'invokeScriptTxs',
    options: createOptions({ dapp: identity, function: identity }),
  },
};

module.exports = compose(
  reduce(
    (acc, [url, { service, options }]) =>
      createEndpoint(url, service, options)(acc),
    new Router()
  ),
  toPairs
)(transactionsEndpointsConfig);
