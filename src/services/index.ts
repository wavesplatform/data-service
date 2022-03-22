import { Task, of as taskOf } from 'folktale/concurrency/task';

import { AppError } from '../errorHandling';

import createAliasesService, { AliasesService } from './aliases';
import createAliasesRepo from './aliases/repo';

import createAssetsService, { AssetsService } from './assets';
import createAssetsRepo, { createCache as createAssetsCache } from './assets/repo';

import createCandlesService, { CandlesService } from './candles';
import createCandlesRepo from './candles/repo';
import createPairsService, { PairsService } from './pairs';
import createPairsRepo, { createCache as createPairsCache } from './pairs/repo';
import createAllTxsService, { AllTxsService } from './transactions/all';
import createAllTxsRepo from './transactions/all/repo';

// alias txs
import createAliasTxsService from './transactions/alias';
import { AliasTxsService } from './transactions/alias/types';
import createAliasTxsRepo from './transactions/alias/repo';
// burn txs
import createBurnTxsService from './transactions/burn';
import { BurnTxsService } from './transactions/burn/types';
import createBurnTxsRepo from './transactions/burn/repo';
// data txs
import createDataTxsService from './transactions/data';
import { DataTxsService } from './transactions/data/types';
import createDataTxsRepo from './transactions/data/repo';
// exchange txs
import createExchangeTxsService from './transactions/exchange';
import { ExchangeTxsService } from './transactions/exchange/types';
import createExchangeTxsRepo from './transactions/exchange/repo';
// genesis txs
import createGenesisTxsService from './transactions/genesis';
import { GenesisTxsService } from './transactions/genesis/types';
import createGenesisTxsRepo from './transactions/genesis/repo';
// invoke script txs
import createInvokeScriptTxsService from './transactions/invokeScript';
import { InvokeScriptTxsService } from './transactions/invokeScript/types';
import createInvokeScriptTxsRepo from './transactions/invokeScript/repo';
// issue txs
import createIssueTxsService from './transactions/issue';
import { IssueTxsService } from './transactions/issue/types';
import createIssueTxsRepo from './transactions/issue/repo';
// lease txs
import createLeaseTxsService from './transactions/lease';
import { LeaseTxsService } from './transactions/lease/types';
import createLeaseTxsRepo from './transactions/lease/repo';
// lease cancel txs
import createLeaseCancelTxsService from './transactions/leaseCancel';
import { LeaseCancelTxsService } from './transactions/leaseCancel/types';
import createLeaseCancelTxsRepo from './transactions/leaseCancel/repo';
// mass-transfer txs
import createMassTransferTxsService from './transactions/massTransfer';
import { MassTransferTxsService } from './transactions/massTransfer/types';
import createMassTransferTxsRepo from './transactions/massTransfer/repo';
// payment txs
import createPaymentTxsService from './transactions/payment';
import { PaymentTxsService } from './transactions/payment/types';
import createPaymentTxsRepo from './transactions/payment/repo';
// reissue txs
import createReissueTxsService from './transactions/reissue';
import { ReissueTxsService } from './transactions/reissue/types';
import createReissueTxsRepo from './transactions/reissue/repo';
// set asset script txs
import createSetAssetScriptTxsService from './transactions/setAssetScript';
import { SetAssetScriptTxsService } from './transactions/setAssetScript/types';
import createSetAssetScriptTxsRepo from './transactions/setAssetScript/repo';
// set script txs
import createSetScriptTxsService from './transactions/setScript';
import { SetScriptTxsService } from './transactions/setScript/types';
import createSetScriptTxsRepo from './transactions/setScript/repo';
// sponsorship txs
import createSponsorshipTxsService from './transactions/sponsorship';
import { SponsorshipTxsService } from './transactions/sponsorship/types';
import createSponsorshipTxsRepo from './transactions/sponsorship/repo';
// transfer txs
import createTransferTxsService from './transactions/transfer';
import { TransferTxsService } from './transactions/transfer/types';
import createTransferTxsRepo from './transactions/transfer/repo';
// update asset info txs
import createUpdateAssetInfoTxsService from './transactions/updateAssetInfo';
import { UpdateAssetInfoTxsService } from './transactions/updateAssetInfo/types';
import createUpdateAssetInfoTxsRepo from './transactions/updateAssetInfo/repo';

import createRateService, { RateCacheImpl, RatesMgetService } from './rates';
import { RateCache } from './rates/repo';
import {
  IThresholdAssetRateService,
  ThresholdAssetRateService,
} from './rates/ThresholdAssetRateService';
import RemoteRateRepo from './rates/repo/impl/RemoteRateRepo';

import { PairOrderingServiceImpl } from './PairOrderingService';

import { DataServiceConfig } from '../loadConfig';
import { PgDriver } from '../db/driver';
import { AssetIdsPair } from '../types';

import { EmitEvent } from './_common/createResolver/types';
import { validatePairs } from './_common/validation/pairs';

type WithEventBus = {
  emitEvent: EmitEvent;
};
export type CommonRepoDependencies = {
  drivers: {
    pg: PgDriver;
  };
} & WithEventBus;

export type RateSerivceCreatorDependencies = WithEventBus & {
  repo: RemoteRateRepo;
  cache: RateCache;
  assets: AssetsService;
  pairs: PairsService;
  pairAcceptanceVolumeThreshold: number;
  thresholdAssetRateService: IThresholdAssetRateService;
  baseAssetId: string;
};

export type ServiceMesh = {
  aliases: AliasesService;
  assets: AssetsService;
  candles: CandlesService;
  matchers: {
    pairs: PairsService;
    candles: CandlesService;
    rates: RatesMgetService;
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
    updateAssetInfo: UpdateAssetInfoTxsService;
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
    matcherConfig[options.matcher.defaultMatcherAddress] = options.matcher.settingsURL;
  }

  // @todo async init whatever is necessary
  return PairOrderingServiceImpl.create(matcherConfig).map((pairOrderingService) => {
    // caches
    const ratesCache = new RateCacheImpl(200000, 60000); // 1 minute
    const pairsCache = createPairsCache(1000, 5000);
    const assetsCache = createAssetsCache(10000, 60000); // 1 minute

    const commonDeps = {
      drivers: {
        pg: pgDriver,
      },
      emitEvent,
    };

    // common init services
    const aliasesRepo = createAliasesRepo(commonDeps);
    const aliases = createAliasesService(aliasesRepo);

    const assetsRepo = createAssetsRepo({
      ...commonDeps,
      cache: assetsCache,
    });
    const assets = createAssetsService(assetsRepo);

    const pairsRepo = createPairsRepo({ ...commonDeps, cache: pairsCache });
    const pairsNoAsyncValidation = createPairsService(
      pairsRepo,
      () => taskOf(undefined),
      assets
    );
    const pairsWithAsyncValidation = createPairsService(
      pairsRepo,
      (matcher: string, pairs: AssetIdsPair[]) =>
        validatePairs(assets.mget, pairOrderingService)(matcher, pairs),
      assets
    );

    const thresholdAssetRateService = new ThresholdAssetRateService(
      options.thresholdAssetId,
      options.matcher.defaultMatcherAddress,
      pairsNoAsyncValidation,
      emitEvent('log')
    );

    const aliasTxsRepo = createAliasTxsRepo(commonDeps);
    const aliasTxs = createAliasTxsService(aliasTxsRepo, assets);
    const burnTxsRepo = createBurnTxsRepo(commonDeps);
    const burnTxs = createBurnTxsService(burnTxsRepo, assets);
    const dataTxsRepo = createDataTxsRepo(commonDeps);
    const dataTxs = createDataTxsService(dataTxsRepo, assets);
    const exchangeTxsRepo = createExchangeTxsRepo(commonDeps);
    const exchangeTxs = createExchangeTxsService(exchangeTxsRepo, assets);
    const genesisTxsRepo = createGenesisTxsRepo(commonDeps);
    const genesisTxs = createGenesisTxsService(genesisTxsRepo, assets);
    const invokeScriptTxsRepo = createInvokeScriptTxsRepo(commonDeps);
    const invokeScriptTxs = createInvokeScriptTxsService(invokeScriptTxsRepo, assets);
    const issueTxsRepo = createIssueTxsRepo(commonDeps);
    const issueTxs = createIssueTxsService(issueTxsRepo, assets);
    const leaseTxsRepo = createLeaseTxsRepo(commonDeps);
    const leaseTxs = createLeaseTxsService(leaseTxsRepo, assets);
    const leaseCancelTxsRepo = createLeaseCancelTxsRepo(commonDeps);
    const leaseCancelTxs = createLeaseCancelTxsService(leaseCancelTxsRepo, assets);
    const massTransferTxsRepo = createMassTransferTxsRepo(commonDeps);
    const massTransferTxs = createMassTransferTxsService(massTransferTxsRepo, assets);
    const paymentTxsRepo = createPaymentTxsRepo(commonDeps);
    const paymentTxs = createPaymentTxsService(paymentTxsRepo, assets);
    const reissueTxsRepo = createReissueTxsRepo(commonDeps);
    const reissueTxs = createReissueTxsService(reissueTxsRepo, assets);
    const setAssetScriptTxsRepo = createSetAssetScriptTxsRepo(commonDeps);
    const setAssetScriptTxs = createSetAssetScriptTxsService(
      setAssetScriptTxsRepo,
      assets
    );
    const setScriptTxsRepo = createSetScriptTxsRepo(commonDeps);
    const setScriptTxs = createSetScriptTxsService(setScriptTxsRepo, assets);
    const sponsorshipTxsRepo = createSponsorshipTxsRepo(commonDeps);
    const sponsorshipTxs = createSponsorshipTxsService(sponsorshipTxsRepo, assets);
    const transferTxsRepo = createTransferTxsRepo(commonDeps);
    const transferTxs = createTransferTxsService(transferTxsRepo, assets);
    const updateAssetInfoRepo = createUpdateAssetInfoTxsRepo(commonDeps);
    const updateAssetInfoTxs = createUpdateAssetInfoTxsService(
      updateAssetInfoRepo,
      assets
    );

    const rateRepo = new RemoteRateRepo(commonDeps.drivers.pg);

    const rates = createRateService({
      ...commonDeps,
      repo: rateRepo,
      cache: ratesCache,
      assets,
      pairs: pairsNoAsyncValidation,
      pairAcceptanceVolumeThreshold: options.pairAcceptanceVolumeThreshold,
      thresholdAssetRateService: thresholdAssetRateService,
      baseAssetId: options.rateBaseAssetId,
    });

    const candlesRepo = createCandlesRepo(commonDeps);
    const candlesNoAsyncValidation = createCandlesService(
      candlesRepo,
      () => taskOf(undefined),
      assets
    );
    const candlesWithAsyncValidation = createCandlesService(
      candlesRepo,
      (matcher: string, pairs: AssetIdsPair[]) =>
        validatePairs(assets.mget, pairOrderingService)(matcher, pairs),
      assets
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
      17: updateAssetInfoTxs,
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
        updateAssetInfo: updateAssetInfoTxs,
      },
      matchers: {
        rates,
        candles: candlesWithAsyncValidation,
        pairs: pairsWithAsyncValidation,
      },
    };
  });
};
