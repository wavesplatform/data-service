import { Task, of as taskOf } from 'folktale/concurrency/task';

import { AppError } from '../errorHandling';
import createAliasesService, { AliasService } from './aliases';
import createAssetsService, {
  AssetsService,
  createCache as createAssetsCache,
} from './assets';
import createCandlesService, { CandlesService } from './candles';
import createPairsService, {
  createCache as createPairsCache,
  PairsService,
} from './pairs';
import createAllTxsService, { AllTxsService } from './transactions/all';
import createAliasTxsService, { AliasTxsService } from './transactions/alias';
import createBurnTxsService, { BurnTxsService } from './transactions/burn';
import createDataTxsService, { DataTxsService } from './transactions/data';
import createExchangeTxsService, {
  ExchangeTxsService,
} from './transactions/exchange';
import createGenesisTxsService, {
  GenesisTxsService,
} from './transactions/genesis';
import createInvokeScriptTxsService, {
  InvokeScriptTxsService,
} from './transactions/invokeScript';
import createIssueTxsService, { IssueTxsService } from './transactions/issue';
import createLeaseTxsService, { LeaseTxsService } from './transactions/lease';
import createLeaseCancelTxsService, {
  LeaseCancelTxsService,
} from './transactions/leaseCancel';
import createMassTransferTxsService, {
  MassTransferTxsService,
} from './transactions/massTransfer';
import createPaymentTxsService, {
  PaymentTxsService,
} from './transactions/payment';
import createReissueTxsService, {
  ReissueTxsService,
} from './transactions/reissue';
import createSetAssetScriptTxsService, {
  SetAssetScriptTxsService,
} from './transactions/setAssetScript';
import createSetScriptTxsService, {
  SetScriptTxsService,
} from './transactions/setScript';
import createSponsorshipTxsService, {
  SponsorshipTxsService,
} from './transactions/sponsorship';
import createTransferTxsService, {
  TransferTxsService,
} from './transactions/transfer';
import { DataServiceConfig } from '../loadConfig';
import createRateService, { RateCacheImpl } from './rates';

import { PairOrderingServiceImpl } from './PairOrderingService';

import { PgDriver } from '../db/driver';
import { EmitEvent } from './_common/createResolver/types';
import { ServiceMget, Rate, RateMgetParams, AssetIdsPair } from '../types';
import { RateCache } from './rates/repo';

import { validatePairs } from './validation/pairs';

export type CommonServiceDependencies = {
  drivers: {
    pg: PgDriver;
  };
  emitEvent: EmitEvent;
};

export type RateSerivceCreatorDependencies = CommonServiceDependencies & {
  cache: RateCache;
};

export type ServiceMesh = {
  aliases: AliasService;
  assets: AssetsService;
  candles: CandlesService;
  matchers: {
    pairs: PairsService;
    candles: CandlesService;
    rates: ServiceMget<RateMgetParams, Rate>;
  };
  pairs: PairsService;
  transactions: {
    all: AllTxsService;
    alias: AliasTxsService;
    burn: BurnTxsService;
    data: DataTxsService;
    exchange: ExchangeTxsService;
    genesis: GenesisTxsService;
    invokeScript: InvokeScriptTxsService;
    issue: IssueTxsService;
    lease: LeaseTxsService;
    leaseCancel: LeaseCancelTxsService;
    massTransfer: MassTransferTxsService;
    payment: PaymentTxsService;
    reissue: ReissueTxsService;
    setAssetScript: SetAssetScriptTxsService;
    setScript: SetScriptTxsService;
    sponsorship: SponsorshipTxsService;
    transfer: TransferTxsService;
  };
};

export default ({
  options,
  pgDriver,
  emitEvent,
}: {
  options: DataServiceConfig;
  pgDriver: PgDriver;
  emitEvent: EmitEvent;
}): Task<AppError, ServiceMesh> =>
  // @todo async init whatever is necessary
  PairOrderingServiceImpl.create({
    [options.matcher.defaultMatcherAddress]: options.matcher.settingsURL,
  }).map(pairOrderingService => {
    // caches
    const ratesCache = new RateCacheImpl(200000, 60000); // 1 minute
    const pairsCache = createPairsCache(1000, 5000);
    const assetsCache = createAssetsCache(10000, 10 * 60 * 1000); // 10 minutes

    const commonDeps = {
      drivers: {
        pg: pgDriver,
      },
      emitEvent,
    };

    // common init services
    const aliases = createAliasesService(commonDeps);
    const assets = createAssetsService({
      ...commonDeps,
      cache: assetsCache,
    });

    const aliasTxs = createAliasTxsService(commonDeps);
    const burnTxs = createBurnTxsService(commonDeps);
    const dataTxs = createDataTxsService(commonDeps);
    const exchangeTxs = createExchangeTxsService(commonDeps);
    const genesisTxs = createGenesisTxsService(commonDeps);
    const invokeScriptTxs = createInvokeScriptTxsService(commonDeps);
    const issueTxs = createIssueTxsService(commonDeps);
    const leaseTxs = createLeaseTxsService(commonDeps);
    const leaseCancelTxs = createLeaseCancelTxsService(commonDeps);
    const massTransferTxs = createMassTransferTxsService(commonDeps);
    const paymentTxs = createPaymentTxsService(commonDeps);
    const reissueTxs = createReissueTxsService(commonDeps);
    const setAssetScriptTxs = createSetAssetScriptTxsService(commonDeps);
    const setScriptTxs = createSetScriptTxsService(commonDeps);
    const sponsorshipTxs = createSponsorshipTxsService(commonDeps);
    const transferTxs = createTransferTxsService(commonDeps);
    const rates = createRateService({
      ...commonDeps,
      cache: ratesCache,
    });

    const pairsNoAsyncValidation = createPairsService({
      ...commonDeps,
      cache: pairsCache,
      validatePairs: () => taskOf(undefined),
    });
    const pairsWithAsyncValidation = createPairsService({
      ...commonDeps,
      cache: pairsCache,
      validatePairs: validatePairs(assets, pairOrderingService),
    });

    const candlesNoAsyncValidation = createCandlesService({
      ...commonDeps,
      validatePair: () => taskOf(undefined),
    });
    const candlesWithAsyncValidation = createCandlesService({
      ...commonDeps,
      validatePair: (matcher: string, pair: AssetIdsPair) =>
        validatePairs(assets, pairOrderingService)(matcher, [pair]),
    });

    // specific init services
    // all txs service
    const allTxs = createAllTxsService(commonDeps)({
      1: genesisTxs,
      2: paymentTxs,
      3: issueTxs,
      4: transferTxs,
      5: reissueTxs,
      6: burnTxs,
      7: exchangeTxs,
      8: leaseTxs,
      9: leaseCancelTxs,
      10: aliasTxs,
      11: massTransferTxs,
      12: dataTxs,
      13: setScriptTxs,
      14: sponsorshipTxs,
      15: setAssetScriptTxs,
      16: invokeScriptTxs,
    });

    return {
      aliases,
      assets,
      candles: candlesNoAsyncValidation,
      pairs: pairsNoAsyncValidation,
      transactions: {
        all: allTxs,
        genesis: genesisTxs,
        payment: paymentTxs,
        issue: issueTxs,
        transfer: transferTxs,
        reissue: reissueTxs,
        burn: burnTxs,
        exchange: exchangeTxs,
        lease: leaseTxs,
        leaseCancel: leaseCancelTxs,
        alias: aliasTxs,
        massTransfer: massTransferTxs,
        data: dataTxs,
        setScript: setScriptTxs,
        sponsorship: sponsorshipTxs,
        setAssetScript: setAssetScriptTxs,
        invokeScript: invokeScriptTxs,
      },
      matchers: {
        rates,
        candles: candlesWithAsyncValidation,
        pairs: pairsWithAsyncValidation,
      },
    };
  });
