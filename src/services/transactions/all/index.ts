import * as Task from 'folktale/concurrency/task';
import * as Maybe from 'folktale/maybe';
import {
  pipe,
  map,
  groupBy,
  prop,
  toPairs,
  pick,
  isNil,
  reject,
  ifElse,
  flatten,
  indexBy,
  identity,
  evolve,
} from 'ramda';
import { CommonServiceDependencies } from '../..';
import {
  List,
  Transaction,
  NotNullTransaction,
  TransactionInfo,
  Service,
} from '../../../types';
import { AppError } from '../../../errorHandling';

import { CommonFilters } from '../_common/types';

import * as commonData from './commonData';
import { WithSortOrder, WithLimit } from '../../_common';
import { RequestWithCursor } from '../../_common/pagination';
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

const getData = prop('data');

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

type AllTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
>;

export type AllTxsService = Service<
  string,
  string[],
  AllTxsSearchRequest,
  Transaction
>;

// @todo
// request by (id, timestamp) instead of just id
// to ensure correct tx response even if
// id is duplicated (happens in payment, alias txs)
export default (deps: CommonServiceDependencies) => (
  txsServices: AllTxsServiceDep
): AllTxsService => {
  const commonTxData = commonData(deps);

  const isEmpty = (t: Transaction) => isNil(t.data);

  /**
   * idTypeFromCommonData
   * List CommonData -> { id, type }[]
   */
  const idTypeFromCommonData = pipe<
    List<NotNullTransaction>,
    NotNullTransaction[],
    { id: string; type: number }[]
  >(
    getData,
    map(
      pipe<NotNullTransaction, TransactionInfo, { id: string; type: number }>(
        getData,
        pick(['id', 'type'])
      )
    )
  );

  /**
   * resultsFromIdType
   * returns unordered response data from types and ids
   * { id, type }[] -> Task TxData[]
   */
  const resultsFromIdType = pipe<
    { id: string; type: number }[],
    {
      [key: string]: {
        id: string;
        type: any;
      }[];
    },
    [any, { id: string; type: string }[]][],
    Task.Task<AppError, List<Transaction>>[],
    Task.Task<AppError, List<NotNullTransaction>[]>,
    Task.Task<AppError, TransactionInfo[]>
  >(
    groupBy(prop('type') as any),
    toPairs,
    (
      tuples: [keyof AllTxsServiceDep, { id: string; type: string }[]][]
    ): Task.Task<AppError, List<Transaction>>[] =>
      tuples.map(([type, txs]) => {
        return txsServices[type].mget(txs.map(prop('id')));
      }),
    Task.waitAll,
    (t: Task.Task<AppError, List<NotNullTransaction>[]>) =>
      t.map(
        pipe(
          (ls: List<NotNullTransaction>[]): NotNullTransaction[][] =>
            ls.map(getData),
          (ls: NotNullTransaction[][]) => flatten<NotNullTransaction>(ls),
          map(getData)
        )
      )
  );

  return {
    get: id =>
      commonTxData
        .get(id) //Task tx
        .chain(
          pipe(
            (m: Maybe.Maybe<NotNullTransaction>) => m.map(getData),
            (m: Maybe.Maybe<TransactionInfo>) =>
              m.matchWith({
                Just: ({ value }: { value: TransactionInfo }) => {
                  return txsServices[value.type as keyof AllTxsServiceDep].get(
                    id
                  );
                },
                Nothing: () => Task.of(Maybe.empty()),
              })
          )
        ),
    mget: ids =>
      commonTxData
        .mget(ids) // Task tx[]. tx can have data: null
        .chain((txsList: List<Transaction>) =>
          pipe(
            (o: any) =>
              evolve({ data: reject(isEmpty) }, o) as List<NotNullTransaction>,
            idTypeFromCommonData,
            resultsFromIdType, // Task TxData[]
            // format output,
            t =>
              t.map(
                pipe<any[], { [key: string]: any }, List<Transaction>>(
                  indexBy(prop<string, string>('id')),
                  resultsMap => ({
                    ...txsList,
                    data: txsList.data.map(
                      ifElse(isEmpty, identity, t => ({
                        ...t,
                        data: resultsMap[t.data.id],
                      }))
                    ),
                  })
                )
              )
          )(txsList)
        ),

    search: filters =>
      commonTxData.search(filters).chain(txsList =>
        pipe<
          List<NotNullTransaction>,
          { id: string; type: number }[],
          Task.Task<AppError, TransactionInfo[]>,
          Task.Task<AppError, List<Transaction>>
        >(
          idTypeFromCommonData,
          resultsFromIdType,
          // format output
          t =>
            t.map(
              pipe<any[], { [key: string]: any }, List<Transaction>>(
                indexBy(prop<string, string>('id')),
                resultsMap =>
                  ({
                    ...txsList,
                    data: txsList.data.map(t => ({
                      ...t,
                      data: resultsMap[t.data.id],
                    })),
                  } as List<Transaction>)
              )
            )
        )(txsList as List<NotNullTransaction>)
      ),
  };
};
