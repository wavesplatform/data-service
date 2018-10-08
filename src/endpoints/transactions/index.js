const { compose, identity, toPairs, reduce } = require('ramda');

const Router = require('koa-router');

const createEndpoint = require('../_common');
const { timeStart, timeEnd, after, limit, ids } = require('../_common/filters');

// services
const genesis = require('../../services/transactions/genesis');
const send = require('../../services/transactions/send');
const issue = require('../../services/transactions/issue');
const transfer = require('../../services/transactions/transfer');
const reissue = require('../../services/transactions/reissue');
const burn = require('../../services/transactions/burn');
const exchange = require('../../services/transactions/exchange');
const lease = require('../../services/transactions/lease');
const leaseCancel = require('../../services/transactions/leaseCancel');
const alias = require('../../services/transactions/alias');
const massTransfer = require('../../services/transactions/massTransfer');
const data = require('../../services/transactions/data');
const setScript = require('../../services/transactions/setScript');
const sponsorship = require('../../services/transactions/sponsorship');
const all = require('../../services/transactions/all');

// filters
const commonTxFilters = {
  ids,
  timeStart,
  timeEnd,
  limit,
  after,
  sender: identity,
};

// common options
const createOptions = specificFilters => ({
  filterParsers: { ...commonTxFilters, ...specificFilters },
});

const transactionsEndpointsConfig = {
  '/transactions/all': {
    service: all,
    options: createOptions(),
  },
  '/transactions/genesis': {
    service: genesis,
    options: undefined,
  },
  '/transactions/send': {
    service: send,
    options: createOptions(),
  },
  '/transactions/issue': {
    service: issue,
    options: createOptions(),
  },
  '/transactions/transfer': {
    service: transfer,
    options: createOptions({
      assetId: identity,
      recipient: identity,
    }),
  },
  '/transactions/reissue': {
    service: reissue,
    options: createOptions(),
  },
  '/transactions/burn': {
    service: burn,
    options: createOptions(),
  },
  '/transactions/exchange': {
    service: exchange,
    options: createOptions({
      matcher: identity,
      amountAsset: identity,
      priceAsset: identity,
    }),
  },
  '/transactions/lease': {
    service: lease,
    options: createOptions({ recipient: identity }),
  },
  '/transactions/lease-cancel': {
    service: leaseCancel,
    options: createOptions({ recipient: identity }),
  },
  '/transactions/alias': {
    service: alias,
    options: createOptions(),
  },
  '/transactions/mass-transfer': {
    service: massTransfer,
    options: createOptions({
      assetId: identity,
      recipient: identity,
    }),
  },
  '/transactions/data': {
    service: data,
    options: { parseFiltersFn: require('./parseDataTxFilters') },
  },
  '/transactions/set-script': {
    service: setScript,
    options: createOptions({ script: identity }),
  },
  '/transactions/sponsorship': {
    service: sponsorship,
    options: createOptions(),
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
