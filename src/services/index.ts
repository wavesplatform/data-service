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
  aliases: AliasService;
  assets: AssetsService;
  candles: CandlesService;
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
    sponsorshop: SponsorshipTxsService;
    transfer: TransferTxsService;
  };
};

export default (options: DataServiceConfig) => async ({
  drivers,
  emitEvent,
}: CommonServiceCreatorDependencies) => {
  const commonDeps = {
    drivers,
    emitEvent,
  };

  // common init services
  const aliases = createAliasesService(commonDeps);
  const assets = createAssetsService(commonDeps);
  const candles = createCandlesService(commonDeps);

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
  const sponsorshopTxs = createSponsorshopTxsService(commonDeps);
  const transferTxs = createTransferTxsService(commonDeps);

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
    14: sponsorshopTxs,
    15: setAssetScriptTxs,
    16: invokeScriptTxs,
  });

  // pairs service
  const pairs = await createPairsService({
    ...commonDeps,
    options,
  })({ issueTxs })
    .run()
    .promise();

  const serviceMesh: ServiceMesh = {
    aliases,
    assets,
    candles,
    pairs,
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
      sponsorshop: sponsorshopTxs,
      setAssetScript: setAssetScriptTxs,
      invokeScript: invokeScriptTxs,
    },
  };
  return serviceMesh;
};
