import { Task, of as taskOf } from 'folktale/concurrency/task';

import { AppError } from '../errorHandling';

import createAliasesService, { AliasesService } from './aliases';
import createAliasesRepo from './aliases/repo';

import createAssetsService, { AssetsService } from './assets';
import createAssetsRepo, {
  createCache as createAssetsCache,
} from './assets/repo';

import createCandlesService, { CandlesService } from './candles';
import createCandlesRepo from './candles/repo';
import createPairsService, { PairsService } from './pairs';
import createPairsRepo, { createCache as createPairsCache } from './pairs/repo';
import createAllTxsService, { AllTxsService } from './transactions/all';
import createAllTxsRepo from './transactions/all/repo';
import createAliasTxsService, { AliasTxsService } from './transactions/alias';
import createAliasTxsRepo from './transactions/alias/repo';
import createBurnTxsService, { BurnTxsService } from './transactions/burn';
import createBurnTxsRepo from './transactions/burn/repo';
import createDataTxsService, { DataTxsService } from './transactions/data';
import createDataTxsRepo from './transactions/data/repo';
import createExchangeTxsService, {
  ExchangeTxsService,
} from './transactions/exchange';
import createExchangeTxsRepo from './transactions/exchange/repo';
import createGenesisTxsService, {
  GenesisTxsService,
} from './transactions/genesis';
import createGenesisTxsRepo from './transactions/genesis/repo';
import createInvokeScriptTxsService, {
  InvokeScriptTxsService,
} from './transactions/invokeScript';
import createInvokeScriptTxsRepo from './transactions/invokeScript/repo';
import createIssueTxsService, { IssueTxsService } from './transactions/issue';
import createIssueTxsRepo from './transactions/issue/repo';
import createLeaseTxsService, { LeaseTxsService } from './transactions/lease';
import createLeaseTxsRepo from './transactions/lease/repo';
import createLeaseCancelTxsService, {
  LeaseCancelTxsService,
} from './transactions/leaseCancel';
import createLeaseCancelTxsRepo from './transactions/leaseCancel/repo';
import createMassTransferTxsService, {
  MassTransferTxsService,
} from './transactions/massTransfer';
import createMassTransferTxsRepo from './transactions/massTransfer/repo';
import createPaymentTxsService, {
  PaymentTxsService,
} from './transactions/payment';
import createPaymentTxsRepo from './transactions/payment/repo';
import createReissueTxsService, {
  ReissueTxsService,
} from './transactions/reissue';
import createReissueTxsRepo from './transactions/reissue/repo';
import createSetAssetScriptTxsService, {
  SetAssetScriptTxsService,
} from './transactions/setAssetScript';
import createSetAssetScriptTxsRepo from './transactions/setAssetScript/repo';
import createSetScriptTxsService, {
  SetScriptTxsService,
} from './transactions/setScript';
import createSetScriptTxsRepo from './transactions/setScript/repo';
import createSponsorshipTxsService, {
  SponsorshipTxsService,
} from './transactions/sponsorship';
import createSponsorshipTxsRepo from './transactions/sponsorship/repo';
import createTransferTxsService, {
  TransferTxsService,
} from './transactions/transfer';
import createTransferTxsRepo from './transactions/transfer/repo';
import { DataServiceConfig } from '../loadConfig';
import createRateService, { RateCacheImpl } from './rates';

import { PairOrderingServiceImpl } from './PairOrderingService';

import { PgDriver } from '../db/driver';
import { EmitEvent } from './_common/createResolver/types';
import {
  Service,
  RateMgetParams,
  AssetIdsPair,
  RateWithPairIds,
} from '../types';
import { RateCache } from './rates/repo';
import { WithDecimalsFormat } from './types';

import { validatePairs } from './_common/validation/pairs';

export type CommonRepoDependencies = {
  drivers: {
    pg: PgDriver;
  };
  emitEvent: EmitEvent;
  timeouts: {
    get: number;
    mget: number;
    search: number;
  };
};

export type RateSerivceCreatorDependencies = CommonRepoDependencies & {
  cache: RateCache;
};

export type ServiceMesh = {
  aliases: AliasesService;
  assets: AssetsService;
  candles: CandlesService;
  matchers: {
    pairs: PairsService;
    candles: CandlesService;
    rates: Service<RateMgetParams & WithDecimalsFormat, RateWithPairIds[]>;
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
}): Task<AppError, ServiceMesh> => {
  let matcherConfig: Record<string, string> = {};

  if (options.matcher.settingsURL) {
    matcherConfig[options.matcher.defaultMatcherAddress] =
      options.matcher.settingsURL;
  }

  // @todo async init whatever is necessary
  return PairOrderingServiceImpl.create(matcherConfig).map(
    pairOrderingService => {
      // caches
      const ratesCache = new RateCacheImpl(200000, 60000); // 1 minute
      const pairsCache = createPairsCache(1000, 5000);
      const assetsCache = createAssetsCache(10000, 60000); // 1 minute

      const commonDeps = {
        drivers: {
          pg: pgDriver,
        },
        emitEvent,
        timeouts: {
          get: options.defaultTimeout,
          mget: options.defaultTimeout,
          search: options.defaultTimeout,
        },
      };

      // common init services
      const aliasesRepo = createAliasesRepo(commonDeps);
      const aliases = createAliasesService(aliasesRepo);

      const assetsRepo = createAssetsRepo({
        ...commonDeps,
        cache: assetsCache,
      });
      const assets = createAssetsService(assetsRepo);

      const aliasTxsRepo = createAliasTxsRepo(commonDeps);
      const aliasTxs = createAliasTxsService(aliasTxsRepo);
      const burnTxsRepo = createBurnTxsRepo(commonDeps);
      const burnTxs = createBurnTxsService(burnTxsRepo);
      const dataTxsRepo = createDataTxsRepo(commonDeps);
      const dataTxs = createDataTxsService(dataTxsRepo);
      const exchangeTxsRepo = createExchangeTxsRepo(commonDeps);
      const exchangeTxs = createExchangeTxsService(exchangeTxsRepo);
      const genesisTxsRepo = createGenesisTxsRepo(commonDeps);
      const genesisTxs = createGenesisTxsService(genesisTxsRepo);
      const invokeScriptTxsRepo = createInvokeScriptTxsRepo(commonDeps);
      const invokeScriptTxs = createInvokeScriptTxsService(invokeScriptTxsRepo);
      const issueTxsRepo = createIssueTxsRepo(commonDeps);
      const issueTxs = createIssueTxsService(issueTxsRepo);
      const leaseTxsRepo = createLeaseTxsRepo(commonDeps);
      const leaseTxs = createLeaseTxsService(leaseTxsRepo);
      const leaseCancelTxsRepo = createLeaseCancelTxsRepo(commonDeps);
      const leaseCancelTxs = createLeaseCancelTxsService(leaseCancelTxsRepo);
      const massTransferTxsRepo = createMassTransferTxsRepo(commonDeps);
      const massTransferTxs = createMassTransferTxsService(massTransferTxsRepo);
      const paymentTxsRepo = createPaymentTxsRepo(commonDeps);
      const paymentTxs = createPaymentTxsService(paymentTxsRepo);
      const reissueTxsRepo = createReissueTxsRepo(commonDeps);
      const reissueTxs = createReissueTxsService(reissueTxsRepo);
      const setAssetScriptTxsRepo = createSetAssetScriptTxsRepo(commonDeps);
      const setAssetScriptTxs = createSetAssetScriptTxsService(
        setAssetScriptTxsRepo
      );
      const setScriptTxsRepo = createSetScriptTxsRepo(commonDeps);
      const setScriptTxs = createSetScriptTxsService(setScriptTxsRepo);
      const sponsorshipTxsRepo = createSponsorshipTxsRepo(commonDeps);
      const sponsorshipTxs = createSponsorshipTxsService(sponsorshipTxsRepo);
      const transferTxsRepo = createTransferTxsRepo(commonDeps);
      const transferTxs = createTransferTxsService(transferTxsRepo);

      const rates = createRateService({
        ...commonDeps,
        cache: ratesCache,
      });

      const pairsRepo = createPairsRepo({ ...commonDeps, cache: pairsCache });
      const pairsNoAsyncValidation = createPairsService(pairsRepo, () =>
        taskOf(undefined)
      );
      const pairsWithAsyncValidation = createPairsService(
        pairsRepo,
        (matcher: string, pairs: AssetIdsPair[]) =>
          validatePairs(assets.mget, pairOrderingService)(matcher, pairs)
      );

      const candlesRepo = createCandlesRepo(commonDeps);
      const candlesNoAsyncValidation = createCandlesService(candlesRepo, () =>
        taskOf(undefined)
      );
      const candlesWithAsyncValidation = createCandlesService(
        candlesRepo,
        (matcher: string, pairs: AssetIdsPair[]) =>
          validatePairs(assets.mget, pairOrderingService)(matcher, pairs)
      );

      // specific init services
      // all txs service
      const allTxsRepo = createAllTxsRepo(commonDeps);
      const allTxs = createAllTxsService(allTxsRepo)({
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
    }
  );
};
