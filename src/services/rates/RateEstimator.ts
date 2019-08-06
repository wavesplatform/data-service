import { Task, waitAll, of as taskOf,  } from "folktale/concurrency/task";
import { Maybe, of as maybeOf, empty as maybeEmpty } from 'folktale/maybe';
import { BigNumber } from "@waves/data-entities";
import { map } from 'ramda';

import { AssetIdsPair, Transaction, ServiceSearch } from "../../types";
import { ExchangeTxsSearchRequest } from "../transactions/exchange";
import { SortOrder } from "../_common";
import { PairOrderingService } from '../rates';
import { AppError } from "../../errorHandling";
import { Monoid } from "../../types/monoid";
import { concatAll } from "../../utils/fp";

const WavesId: string = 'WAVES';

const sum = (data: Array<BigNumber | number | string>): Maybe<BigNumber> => {
  if (data.length === 0) {
    return maybeEmpty();
  }

  return maybeOf(data.reduce((acc: BigNumber, x) => acc.plus(x), new BigNumber(0)));
}

/**
   returns a monoid to select first task satisfying predicate, left to right. 
   Short circuits tasks execution on valid left
*/
function anyTaskSatisfying<L, R>(pred: (val: R) => boolean): Monoid<Task<L, Maybe<R>>> {
  return {
    empty: taskOf(maybeEmpty()),
    concat: (a: Task<L, Maybe<R>>, b: Task<L, Maybe<R>>) =>
      a.chain(
        value => value.filter(pred).matchWith(
          {
            Nothing: () => b.map(res => res.filter(pred)),
            Just: ({ value }) => taskOf(maybeOf(value))
          }
        )
      )
  }
}

/**
   returns first task to yield the posifive BigNumber value
*/
const firstPositive = concatAll<Task<AppError, Maybe<BigNumber>>>(
  anyTaskSatisfying(
    (val: BigNumber) => val.isPositive()
  )
);

type ExchangeInfo = {
  price: number,
  amount: number,
}

const weightedAverage = (data: ExchangeInfo[]): Maybe<BigNumber> => data.length === 0 ? maybeEmpty() :
  maybeMap2(
    (sum1, sum2) => sum1.div(sum2),
    sum(
      data.map(({ price, amount }) => new BigNumber(price).multipliedBy(amount))
    ),
    sum(
      data.map(({ amount }) => amount)
    ).filter(it => !it.isZero())    
  );

const maybeMap2 = <T1, T2, R>(fn: (v1: T1, v2: T2) => R, v1: Maybe<T1>, v2: Maybe<T2>): Maybe<R> =>
  v1.chain(v1 => v2.map(v2 => fn(v1, v2)))

enum RateOrder {
  Straight, Inverted
}

type RateRequest = {
  amountAsset: string, priceAsset: string, order: RateOrder
}

export default class RateEstimator {
  constructor(
    private readonly transactionService: ServiceSearch<ExchangeTxsSearchRequest, Transaction>,    
    private readonly pairOrderingService: PairOrderingService
  ) {}

  private countRateFromTransactions({ amountAsset, priceAsset, order }: RateRequest, matcher: string, timestamp: Date): Task<AppError, Maybe<BigNumber>> {
    return this.transactionService.search(
      {
        amountAsset,
        priceAsset,
        limit: 5,
        matcher,
        sender: matcher,
        timeStart: new Date(0),
        timeEnd: timestamp,
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

  private getRateCandidates(asset1: string, asset2: string, matcher: string): Task<AppError, RateRequest[]> {
    return this.pairOrderingService.getCorrectOrder(matcher, [asset1, asset2])
      .map(
        (res: Maybe<[string, string]>): RateRequest[] => res.matchWith(
          {
            Just: ({ value: [amountAsset, priceAsset] }) =>
              [
                {
                  amountAsset,
                  priceAsset,
                  order: asset1 === amountAsset ? RateOrder.Straight : RateOrder.Inverted
                }
              ],
            
            Nothing: () =>
              [
                { amountAsset: asset1, priceAsset: asset2, order: RateOrder.Straight },
                { amountAsset: asset2, priceAsset: asset1, order: RateOrder.Inverted }
              ]
          }
        )
      )
  }
  
  private getActualRate(asset1: string, asset2: string, matcher: string, timestamp: Date): Task<AppError, Maybe<BigNumber>> {
    const candidates: Task<AppError, RateRequest[]> = this.getRateCandidates(asset1, asset2, matcher)

    const results = candidates.map(
      data => map(request => this.countRateFromTransactions(request, matcher, timestamp), data)
    )

    return results.chain(tasks => firstPositive(tasks))
  }

  estimate({ amountAsset, priceAsset }: AssetIdsPair, matcher: string, timestamp: Date): Task<AppError, BigNumber> {
    if (amountAsset === priceAsset) {
      return taskOf(new BigNumber(1));
    }

    const allRateTasks: Task<AppError, Maybe<BigNumber>>[] = [
      this.getActualRate(amountAsset, priceAsset, matcher, timestamp)
    ]

    if (amountAsset !== WavesId && priceAsset !== WavesId) {
      allRateTasks.push(
        waitAll(
          [
            this.getActualRate(amountAsset, WavesId, matcher, timestamp),
            this.getActualRate(priceAsset, WavesId, matcher, timestamp)
          ]
        ).map(([rate1, rate2]) => maybeMap2(
          (rate1, rate2) => rate2.eq(0) ? new BigNumber(0) : rate1.div(rate2),
          rate1,
          rate2
        ))
      )
    }

    return firstPositive(allRateTasks)
      .map(res => res.getOrElse(new BigNumber(0)))
  }
}
