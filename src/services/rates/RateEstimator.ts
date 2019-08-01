import { Task, waitAll, of as taskOf } from "folktale/concurrency/task";
import * as maybe from 'folktale/maybe';
import { BigNumber } from "@waves/data-entities";
import { map, always } from 'ramda';

import { AssetIdsPair, Transaction, ServiceSearch } from "../../types";
import { ExchangeTxsSearchRequest } from "../transactions/exchange";
import { SortOrder } from "../_common";
import { PairCheckService } from '../rates';
import { AppError } from "../../errorHandling";

const WavesId: string = 'WAVES';

const sum = (data: Array<BigNumber | number | string>): maybe.Maybe<BigNumber> => {
  if (data.length === 0) {
    return maybe.empty();
  }

  return maybe.of(data.reduce((acc: BigNumber, x) => acc.plus(x), new BigNumber(0)));
}

// const max = (data: BigNumber[]): maybe.Maybe<BigNumber> =>
//   data.length === 0 ? maybe.empty() : maybe.of(BigNumber.max(...data));

const firstTask = <L, R>(pred: (val: R) => boolean, tasks: Array<Task<L, maybe.Maybe<R>>>): Task<L, maybe.Maybe<R>> =>
  tasks.length === 0 ? taskOf(maybe.empty()) : tasks.reduce(
    (acc: Task<L, maybe.Maybe<R>>, nextTask: Task<L, maybe.Maybe<R>>) =>
      acc.chain(
        (value: maybe.Maybe<R>) => value.filter(pred).matchWith(
          {
            Nothing: always(nextTask),
            Just: ({ value }) => taskOf(maybe.of(value))
          }
        )
      ).map(res => res.filter(pred))
  )  

type ExchangeInfo = {
  price: number,
  amount: number,
}

const weightedAverage = (data: ExchangeInfo[]): maybe.Maybe<BigNumber> => data.length === 0 ? maybe.empty() :
  sum(
    data.map(({ price, amount }) => new BigNumber(price).multipliedBy(amount))
  ).chain(
    sum1 => sum(data.map(({ amount }) => amount))
      .filter(it => !it.isZero())
      .map(sum2 => sum1.div(sum2))      
  )

const maybeMap2 = <T1, T2, R>(fn: (v1: T1, v2: T2) => R, v1: maybe.Maybe<T1>, v2: maybe.Maybe<T2>): maybe.Maybe<R> =>
  v1.chain(v1 => v2.map(v2 => fn(v1, v2)))

enum RateOrder {
  Straight, Inverted
}

type RateRequest = [string, string, RateOrder];

export default class RateEstimator {
  constructor(
    private readonly transactionService: ServiceSearch<ExchangeTxsSearchRequest, Transaction>,    
    private readonly pairChecker: PairCheckService
  ) {}

  estimate(request: AssetIdsPair, matcher: string): Task<AppError, BigNumber> {
    return this.getRate(request.amountAsset, request.priceAsset, matcher)
  }

  private countRateFromTransactions([amountAsset, priceAsset, order]: RateRequest, matcher: string): Task<AppError, maybe.Maybe<BigNumber>> {
    return this.transactionService.search(
      {
        amountAsset,
        priceAsset,
        limit: 5,
        matcher,
        sender: matcher,
        timeStart: new Date(0),
        timeEnd: new Date(),
        sort: SortOrder.Descending,
      }
    )
      .map(
        // TODO: fix any
        transactions => weightedAverage(transactions.data.map(it => it.data as any as ExchangeInfo))
      )
      .map(
        res => {
          if (order === RateOrder.Straight) {
            return res;
          }

          return res.map(value => value.isZero() ? value : new BigNumber(1).div(value))
        }
      )
  }

  private getRateCandidates(from: string, to: string, matcher: string): Task<AppError, RateRequest[]> {
    return this.pairChecker.checkPair(matcher, [from, to])
      .map(
        (res: maybe.Maybe<[string, string]>): RateRequest[] => res.matchWith(
          {
            Just: ({ value: [actualFrom, actualTo] }) =>
              [[actualFrom, actualTo, from === actualFrom ? RateOrder.Straight : RateOrder.Inverted] as RateRequest],
            
            Nothing: () =>
              [[from, to, RateOrder.Straight] as RateRequest, [to, from, RateOrder.Inverted] as RateRequest]
          }
        )
      )
  }
  
  private getActualRate(from: string, to: string, matcher: string): Task<AppError, maybe.Maybe<BigNumber>> {
    const candidates: Task<AppError, RateRequest[]> = this.getRateCandidates(from, to, matcher)

    const results = candidates.map(
      data => map(request => this.countRateFromTransactions(request, matcher), data)
    )

    return results.chain(tasks => firstTask((val: BigNumber) => val.isPositive(), tasks))
  }

  private getRate(amountAsset: string, priceAsset: string, matcher: string): Task<AppError, BigNumber> {
    if (amountAsset === priceAsset) {
      return taskOf(new BigNumber(1));
    } if (amountAsset === WavesId || priceAsset === WavesId) {
      return this.getActualRate(amountAsset, priceAsset, matcher).map(res => res.getOrElse(new BigNumber(0)));
    } else {
      return waitAll(
        [
          this.getActualRate(amountAsset, WavesId, matcher),
          this.getActualRate(priceAsset, WavesId, matcher)
        ]
      ).map(([rate1, rate2]) => maybeMap2(
        (rate1, rate2) => rate2.eq(0) ? new BigNumber(0) : rate1.div(rate2),
        rate1,
        rate2
      ).getOrElse(new BigNumber(0)));
    }
  }
}
