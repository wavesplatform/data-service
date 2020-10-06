import { waitAll, of as taskOf, Task } from 'folktale/concurrency/task';
import { Maybe, empty as emptyOf } from 'folktale/maybe';
import { pipe, groupBy, toPairs, flatten, sort, indexBy } from 'ramda';

import { AppError } from '../../../errorHandling';
import {
  TransactionInfo,
  Service,
  SearchedItems,
  ServiceMgetRequest,
  ServiceGetRequest,
  CommonTransactionInfo,
} from '../../../types';
import { SortOrder } from '../../_common';
import { GenesisTxsService } from '../genesis/types';
import { PaymentTxsService } from '../payment/types';
import { IssueTxsService } from '../issue/types';
import { TransferTxsService } from '../transfer/types';
import { ReissueTxsService } from '../reissue/types';
import { BurnTxsService } from '../burn/types';
import { ExchangeTxsService } from '../exchange/types';
import { LeaseTxsService } from '../lease/types';
import { LeaseCancelTxsService } from '../leaseCancel/types';
import { AliasTxsService } from '../alias/types';
import { MassTransferTxsService } from '../massTransfer/types';
import { DataTxsService } from '../data/types';
import { SetScriptTxsService } from '../setScript/types';
import { SponsorshipTxsService } from '../sponsorship/types';
import { SetAssetScriptTxsService } from '../setAssetScript/types';
import { InvokeScriptTxsService } from '../invokeScript/types';
import { UpdateAssetInfoTxsService } from '../updateAssetInfo/types';
import {
  AllTxsRepo,
  AllTxsGetRequest,
  AllTxsMgetRequest,
  AllTxsSearchRequest,
} from './repo/types';
import { WithDecimalsFormat, DecimalsFormat } from '../../types';
import { collect } from '../../../utils/collection';

type AllTxsServiceDep = {
  1: GenesisTxsService;
  2: PaymentTxsService;
  3: IssueTxsService;
  4: TransferTxsService;
  5: ReissueTxsService;
  6: BurnTxsService;
  7: ExchangeTxsService;
  8: LeaseTxsService;
  9: LeaseCancelTxsService;
  10: AliasTxsService;
  11: MassTransferTxsService;
  12: DataTxsService;
  13: SetScriptTxsService;
  14: SponsorshipTxsService;
  15: SetAssetScriptTxsService;
  16: InvokeScriptTxsService;
  17: UpdateAssetInfoTxsService;
};

export type AllTxsServiceGetRequest = ServiceGetRequest<AllTxsGetRequest>;
export type AllTxsServiceMgetRequest = ServiceMgetRequest<AllTxsMgetRequest>;
export type AllTxsServiceSearchRequest = AllTxsSearchRequest;

export type AllTxsService = {
  get: Service<
    AllTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<TransactionInfo>
  >;
  mget: Service<
    AllTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<TransactionInfo>[]
  >;
  search: Service<
    AllTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<TransactionInfo>
  >;
};

// @todo
// request by (id, timestamp) instead of just id
// to ensure correct tx response even if
// id is duplicated (happens in payment, alias txs)
export default (repo: AllTxsRepo) => (
  txsServices: AllTxsServiceDep
): AllTxsService => ({
  get: (req) =>
    repo
      .get(req.id) //Task tx
      .chain((m) =>
        m.matchWith({
          Just: ({ value }) => {
            return txsServices[value.type as keyof AllTxsServiceDep].get({
              id: value.id,
              decimalsFormat: DecimalsFormat.Long,
            });
          },
          Nothing: () => taskOf(emptyOf()),
        })
      ),

  mget: (req) =>
    repo
      .mget(req.ids) // Task tx[]. tx can have data: null
      .chain((txsList: Maybe<TransactionInfo>[]) =>
        waitAll(
          txsList.map((m) =>
            m.matchWith({
              Just: ({ value }) => {
                return txsServices[value.type as keyof AllTxsServiceDep].get({
                  id: value.id,
                  decimalsFormat: DecimalsFormat.Long,
                });
              },
              Nothing: () => taskOf(emptyOf()),
            })
          )
        )
      ),

  search: (req) =>
    repo.search(req).chain((txsList: SearchedItems<CommonTransactionInfo>) =>
      waitAll<AppError, Maybe<TransactionInfo>[]>(
        pipe<
          CommonTransactionInfo[],
          Record<string, CommonTransactionInfo[]>,
          [string, CommonTransactionInfo[]][],
          Task<AppError, Maybe<TransactionInfo>[]>[]
        >(
          groupBy((t) => String(t.type)),
          toPairs,
          (tuples) =>
            tuples.map(([type, txs]) => {
              return txsServices[
                (type as unknown) as keyof AllTxsServiceDep
              ].mget({
                ids: txs.map((t) => t.id),
                decimalsFormat: req.decimalsFormat,
              });
            })
        )(txsList.items)
      )
        .map((mss) => flatten<Maybe<TransactionInfo>>(mss))
        .map((ms) => collect((m) => m.getOrElse(undefined), ms))
        .map((txs) => {
          const s = indexBy(
            (tx) => `${tx.id}:${tx.timestamp.valueOf()}`,
            txsList.items
          );
          return sort((a, b) => {
            const aTxUid = s[`${a.id}:${a.timestamp.valueOf()}`]['txUid'];
            const bTxUid = s[`${b.id}:${b.timestamp.valueOf()}`]['txUid'];
            return req.sort === SortOrder.Ascending
              ? aTxUid.minus(bTxUid).toNumber()
              : bTxUid.minus(aTxUid).toNumber();
          }, txs);
        })
        .map((txs) => ({
          ...txsList,
          items: txs,
        }))
    ),
});
