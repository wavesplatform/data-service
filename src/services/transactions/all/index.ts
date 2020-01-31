import { waitAll, of as taskOf } from 'folktale/concurrency/task';
import { Maybe, empty as emptyOf } from 'folktale/maybe';
import { pipe, groupBy, prop, toPairs, flatten } from 'ramda';
import {
  TransactionInfo,
  Service,
  SearchedItems,
  ServiceMgetRequest,
  ServiceGetRequest,
} from '../../../types';

import { GenesisTxsService } from '../genesis';
import { PaymentTxsService } from '../payment';
import { IssueTxsService } from '../issue';
import { TransferTxsService } from '../transfer';
import { ReissueTxsService } from '../reissue';
import { BurnTxsService } from '../burn';
import { ExchangeTxsService } from '../exchange';
import { LeaseTxsService } from '../lease';
import { LeaseCancelTxsService } from '../leaseCancel';
import { AliasTxsService } from '../alias';
import { MassTransferTxsService } from '../massTransfer';
import { DataTxsService } from '../data';
import { SetScriptTxsService } from '../setScript';
import { SponsorshipTxsService } from '../sponsorship';
import { SetAssetScriptTxsService } from '../setAssetScript';
import { InvokeScriptTxsService } from '../invokeScript';
import {
  AllTxsRepo,
  AllTxsGetRequest,
  AllTxsMgetRequest,
  AllTxsSearchRequest,
} from './repo/types';
import { WithDecimalsFormat, DecimalsFormat } from '../../types';

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
  get: req =>
    repo
      .get(req.id) //Task tx
      .chain(m =>
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

  mget: req =>
    repo
      .mget(req.ids) // Task tx[]. tx can have data: null
      .chain((txsList: Maybe<TransactionInfo>[]) =>
        waitAll(
          txsList.map(m =>
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

  search: req =>
    repo.search(req).chain((txsList: SearchedItems<TransactionInfo>) =>
      waitAll(
        pipe(groupBy(prop('type') as any), toPairs, tuples =>
          tuples.map(([type, txs]) => {
            return txsServices[
              (type as unknown) as keyof AllTxsServiceDep
            ].mget({
              ids: ((txs as unknown) as TransactionInfo[]).map(prop('id')),
              decimalsFormat: req.decimalsFormat,
            });
          })
        )(txsList.items)
      ).map(txs => ({
        ...txsList,
        items: (flatten(
          txs.map(ts => ts.map(m => m.unsafeGet()))
        ) as unknown) as TransactionInfo[],
      }))
    ),
});
