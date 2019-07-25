import * as LRU from 'lru-cache';
import { Middleware } from 'koa-compose';
import { createOrderPair, TOrderPair } from '@waves/assets-pairs-order';

import { Service, Serializable } from '../types';
import { loadMatcherSettings } from '../loadMatcherSettings';

import createAliasesService, { AliasService } from '../services/aliases';
import createAssetsService, { AssetsService } from '../services/assets';
import createCandlesService, { CandlesService } from '../services/candles';
import createPairsService, { PairsService } from '../services/pairs';
import * as createAllTxsService from '../services/transactions/all';
import createAliasTxsService, {
  AliasTxsService,
} from '../services/transactions/alias';
import createBurnTxsService, {
  BurnTxsService,
} from '../services/transactions/burn';
import createDataTxsService, {
  DataTxsService,
} from '../services/transactions/data';
import createExchangeTxsService, {
  ExchangeTxsService,
} from '../services/transactions/exchange';
import createGenesisTxsService, {
  GenesisTxsService,
} from '../services/transactions/genesis';
import createInvokeScriptTxsService, {
  InvokeScriptTxsService,
} from '../services/transactions/invokeScript';
import createIssueTxsService, {
  IssueTxsService,
} from '../services/transactions/issue';
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

export type ServiceMesh = {
  aliases?: AliasService;
  assets?: AssetsService;
  candles?: CandlesService;
  pairs?: PairsService;
  allTxs?: Service<Serializable<string, any>>;
  aliasTxs?: AliasTxsService;
  burnTxs?: BurnTxsService;
  dataTxs?: DataTxsService;
  exchangeTxs?: ExchangeTxsService;
  genesisTxs?: GenesisTxsService;
  invokeScriptTxs?: InvokeScriptTxsService;
  issueTxs?: IssueTxsService;
  leaseTxs?: Service<Serializable<string, any>>;
  leaseCancelTxs?: Service<Serializable<string, any>>;
  massTransferTxs?: Service<Serializable<string, any>>;
  paymentTxs?: Service<Serializable<string, any>>;
  reissueTxs?: Service<Serializable<string, any>>;
  setAssetScriptTxs?: Service<Serializable<string, any>>;
  setScriptTxs?: Service<Serializable<string, any>>;
  sponsorshopTxs?: Service<Serializable<string, any>>;
  transferTxs?: Service<Serializable<string, any>>;
};

const commonInitServiceMesh: { [slug in keyof ServiceMesh]: any } = {
  aliases: createAliasesService,
  assets: createAssetsService,
  candles: createCandlesService,
  allTxs: createAllTxsService,
  aliasTxs: createAliasTxsService,
  burnTxs: createBurnTxsService,
  dataTxs: createDataTxsService,
  exchangeTxs: createExchangeTxsService,
  genesisTxs: createGenesisTxsService,
  invokeScriptTxs: createInvokeScriptTxsService,
  issueTxs: createIssueTxsService,
  leaseTxs: createLeaseTxsService,
  leaseCancelTxs: createLeaseCancelTxsService,
  massTransferTxs: createMassTransferTxsService,
  paymentTxs: createPaymentTxsService,
  reissueTxs: createReissueTxsService,
  setAssetScriptTxs: createSetAssetScriptTxsService,
  setScriptTxs: createSetScriptTxsService,
  sponsorshopTxs: createSponsorshopTxsService,
  transferTxs: createTransferTxsService,
};

export default (options: DataServiceConfig): Middleware<any> => async (
  ctx,
  next
) => {
  const {
    state: { drivers },
    emitEvent,
  } = ctx;

  const serviceMesh: ServiceMesh = {};

  const commonDeps = {
    drivers,
    emitEvent,
  };

  // common init services
  serviceMesh.aliases = commonInitServiceMesh.aliases(commonDeps);
  serviceMesh.assets = commonInitServiceMesh.assets(commonDeps);
  serviceMesh.candles = commonInitServiceMesh.candles(commonDeps);
  serviceMesh.allTxs = commonInitServiceMesh.allTxs(commonDeps);
  serviceMesh.aliasTxs = commonInitServiceMesh.aliasTxs(commonDeps);
  serviceMesh.burnTxs = commonInitServiceMesh.burnTxs(commonDeps);
  serviceMesh.dataTxs = commonInitServiceMesh.dataTxs(commonDeps);
  serviceMesh.exchangeTxs = commonInitServiceMesh.exchangeTxs(commonDeps);
  serviceMesh.genesisTxs = commonInitServiceMesh.genesisTxs(commonDeps);
  serviceMesh.invokeScriptTxs = commonInitServiceMesh.invokeScriptTxs(
    commonDeps
  );
  serviceMesh.issueTxs = commonInitServiceMesh.issueTxs(commonDeps);
  serviceMesh.leaseTxs = commonInitServiceMesh.leaseTxs(commonDeps);
  serviceMesh.leaseCancelTxs = commonInitServiceMesh.leaseCancelTxs(commonDeps);
  serviceMesh.massTransferTxs = commonInitServiceMesh.massTransferTxs(
    commonDeps
  );
  serviceMesh.paymentTxs = commonInitServiceMesh.paymentTxs(commonDeps);
  serviceMesh.reissueTxs = commonInitServiceMesh.reissueTxs(commonDeps);
  serviceMesh.setAssetScriptTxs = commonInitServiceMesh.setAssetScriptTxs(
    commonDeps
  );
  serviceMesh.setScriptTxs = commonInitServiceMesh.setScriptTxs(commonDeps);
  serviceMesh.sponsorshopTxs = commonInitServiceMesh.sponsorshopTxs(commonDeps);
  serviceMesh.transferTxs = commonInitServiceMesh.transferTxs(commonDeps);

  // specific init services
  const settings = await loadMatcherSettings(options);
  const pairsService = createPairsService({
    ...commonDeps,
    cache,
    orderPair: createOrderPair(settings.priceAssets),
  })(serviceMesh);

  serviceMesh.pairs = pairsService;

  ctx.services = serviceMesh;

  await next();
};
