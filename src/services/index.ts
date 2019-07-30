import createAliasesService, { AliasService } from './aliases';
import createAssetsService, { AssetsService } from './assets';
import createCandlesService, { CandlesService } from './candles';
import createPairsService, { PairsService } from './pairs';
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
import createSponsorshopTxsService, {
  SponsorshipTxsService,
} from './transactions/sponsorship';
import createTransferTxsService, {
  TransferTxsService,
} from './transactions/transfer';
import { DataServiceConfig } from '../loadConfig';

import { PgDriver } from '../db/driver';
import { EmitEvent } from './_common/createResolver/types';

export type CommonServiceCreatorDependencies = {
  drivers: { pg: PgDriver };
  emitEvent: EmitEvent;
};

export type ServiceMesh = {
  aliases?: AliasService;
  assets?: AssetsService;
  candles?: CandlesService;
  pairs?: PairsService;
  transactions: {
    allTxs?: AllTxsService;
    aliasTxs?: AliasTxsService;
    burnTxs?: BurnTxsService;
    dataTxs?: DataTxsService;
    exchangeTxs?: ExchangeTxsService;
    genesisTxs?: GenesisTxsService;
    invokeScriptTxs?: InvokeScriptTxsService;
    issueTxs?: IssueTxsService;
    leaseTxs?: LeaseTxsService;
    leaseCancelTxs?: LeaseCancelTxsService;
    massTransferTxs?: MassTransferTxsService;
    paymentTxs?: PaymentTxsService;
    reissueTxs?: ReissueTxsService;
    setAssetScriptTxs?: SetAssetScriptTxsService;
    setScriptTxs?: SetScriptTxsService;
    sponsorshopTxs?: SponsorshipTxsService;
    transferTxs?: TransferTxsService;
  };
};

const commonInitServiceMesh: { [slug in keyof ServiceMesh]: any } = {
  aliases: createAliasesService,
  assets: createAssetsService,
  candles: createCandlesService,
  pairs: createPairsService,
  transactions: {
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
  },
};

export default (options: DataServiceConfig) => async ({
  drivers,
  emitEvent,
}: CommonServiceCreatorDependencies) => {
  const serviceMesh: ServiceMesh = { transactions: {} };

  const commonDeps = {
    drivers,
    emitEvent,
  };

  // common init services
  serviceMesh.aliases = commonInitServiceMesh.aliases(commonDeps);
  serviceMesh.assets = commonInitServiceMesh.assets(commonDeps);
  serviceMesh.candles = commonInitServiceMesh.candles(commonDeps);

  serviceMesh.transactions = {
    aliasTxs: commonInitServiceMesh.transactions.aliasTxs(commonDeps),
    burnTxs: commonInitServiceMesh.transactions.burnTxs(commonDeps),
    dataTxs: commonInitServiceMesh.transactions.dataTxs(commonDeps),
    exchangeTxs: commonInitServiceMesh.transactions.exchangeTxs(commonDeps),
    genesisTxs: commonInitServiceMesh.transactions.genesisTxs(commonDeps),
    invokeScriptTxs: commonInitServiceMesh.transactions.invokeScriptTxs(
      commonDeps
    ),
    issueTxs: commonInitServiceMesh.transactions.issueTxs(commonDeps),
    leaseTxs: commonInitServiceMesh.transactions.leaseTxs(commonDeps),
    leaseCancelTxs: commonInitServiceMesh.transactions.leaseCancelTxs(
      commonDeps
    ),
    massTransferTxs: commonInitServiceMesh.transactions.massTransferTxs(
      commonDeps
    ),
    paymentTxs: commonInitServiceMesh.transactions.paymentTxs(commonDeps),
    reissueTxs: commonInitServiceMesh.transactions.reissueTxs(commonDeps),
    setAssetScriptTxs: commonInitServiceMesh.transactions.setAssetScriptTxs(
      commonDeps
    ),
    setScriptTxs: commonInitServiceMesh.transactions.setScriptTxs(commonDeps),
    sponsorshopTxs: commonInitServiceMesh.transactions.sponsorshopTxs(
      commonDeps
    ),
    transferTxs: commonInitServiceMesh.transactions.transferTxs(commonDeps),
  };

  // specific init services
  // all txs service
  const allTxsService = createAllTxsService(commonDeps)({
    1: serviceMesh.transactions.genesisTxs,
    2: serviceMesh.transactions.paymentTxs,
    3: serviceMesh.transactions.issueTxs,
    4: serviceMesh.transactions.transferTxs,
    5: serviceMesh.transactions.reissueTxs,
    6: serviceMesh.transactions.burnTxs,
    7: serviceMesh.transactions.exchangeTxs,
    8: serviceMesh.transactions.leaseTxs,
    9: serviceMesh.transactions.leaseCancelTxs,
    10: serviceMesh.transactions.aliasTxs,
    11: serviceMesh.transactions.massTransferTxs,
    12: serviceMesh.transactions.dataTxs,
    13: serviceMesh.transactions.setScriptTxs,
    14: serviceMesh.transactions.sponsorshopTxs,
    15: serviceMesh.transactions.setAssetScriptTxs,
    16: serviceMesh.transactions.invokeScriptTxs,
  });
  serviceMesh.transactions.allTxs = allTxsService;
  // pairs service
  serviceMesh.pairs = await commonInitServiceMesh.pairs({
    ...commonDeps,
    options,
  })({ issueTxs: serviceMesh.transactions.issueTxs });

  return serviceMesh;
};
