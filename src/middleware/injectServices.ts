import { createOrderPair, TOrderPair } from '@waves/assets-pairs-order';
import * as LRU from 'lru-cache';
import { Middleware } from 'koa-compose';

import {
  Pair,
  Transaction,
  Service,
  ServiceMesh,
  Serializable,
} from '../types';
import { loadMatcherSettings } from '../loadMatcherSettings';

import createAliasesService from '../services/aliases';
import createAssetsService from '../services/assets';
import createCandlesService from '../services/candles';
import createPairsService from '../services/pairs';
import createAliasTxsService from '../services/transactions/alias';
import createAllTxsService from '../services/transactions/all';
import createBurnTxsService from '../services/transactions/burn';
import createDataTxsService from '../services/transactions/data';
import createExchangeTxsService from '../services/transactions/exchange';
import createGenesisTxsService from '../services/transactions/genesis';
import createInvokeScriptTxsService from '../services/transactions/invokeScript';
import createIssueTxsService from '../services/transactions/issue';
import createLeaseTxsService from '../services/transactions/lease';
import createLeaseCancelTxsService from '../services/transactions/leaseCancel';
import createMassTransferTxsService from '../services/transactions/massTransfer';
import createPaymentTxsService from '../services/transactions/payment';
import createReissueTxsService from '../services/transactions/reissue';
import createSetAssetScriptTxsService from '../services/transactions/setAssetScript';
import createSetScriptTxsService from '../services/transactions/setScript';
import createSponsorshopTxsService from '../services/transactions/sponsorship';
import createTransferTxsService from '../services/transactions/transfer';
import { DataServiceConfig } from './../loadConfig';

import { PgDriver } from '../db/driver';
import { EmitEvent } from '../services/_common/createResolver/types';

const cache = new LRU(100000);
cache.set('WAVES', true);

export type CommonServiceCreatorDependencies = {
  drivers: { pg: PgDriver };
  emitEvent: EmitEvent;
};

export type PairsServiceCreatorDependencies = CommonServiceCreatorDependencies & {
  orderPair: TOrderPair;
  cache: LRU<any, any>;
};

const commonInitServiceMesh: {
  [alias: string]: (
    deps: CommonServiceCreatorDependencies
  ) => Service<Serializable<string, any>>;
} = {
  aliasesService: createAliasesService,
  assetsService: createAssetsService,
  aliasTxsService: createAliasTxsService,
  allTxsService: createAllTxsService,
  burnTxsService: createBurnTxsService,
  dataTxsService: createDataTxsService,
  exchangeTxsService: createExchangeTxsService,
  genesisTxsService: createGenesisTxsService,
  invokeScriptTxsService: createInvokeScriptTxsService,
  issueTxsService: createIssueTxsService,
  leaseTxsService: createLeaseTxsService,
  leaseCancelTxsService: createLeaseCancelTxsService,
  massTransferTxsService: createMassTransferTxsService,
  paymentTxsService: createPaymentTxsService,
  reissueTxsService: createReissueTxsService,
  setAssetScriptTxsService: createSetAssetScriptTxsService,
  setScriptTxsService: createSetScriptTxsService,
  sponsorshopTxsService: createSponsorshopTxsService,
  transferTxsService: createTransferTxsService,
};

export default (options: DataServiceConfig): Middleware<any> => async (
  ctx,
  next
) => {
  const {
    state: { drivers },
    emitEvent,
  } = ctx;

  // common init services
  const serviceMesh: ServiceMesh = {};

  Object.keys(commonInitServiceMesh).forEach(serviceSlug => {
    serviceMesh[serviceSlug] = commonInitServiceMesh[serviceSlug]({
      drivers,
      emitEvent,
    });
  });

  // specific init services
  const settings = await loadMatcherSettings(options);
  const pairsService: Service<Pair> = createPairsService({
    drivers,
    emitEvent,
    cache,
    orderPair: createOrderPair(settings.priceAssets),
  })(serviceMesh);
  serviceMesh.pairsService = pairsService;

  ctx.services = serviceMesh;

  await next();
};
