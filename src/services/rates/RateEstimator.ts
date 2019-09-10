import { Task, of as taskOf } from "folktale/concurrency/task";
import { Maybe,
         of as maybeOf,
         empty as maybeEmpty,
       } from 'folktale/maybe';

import { BigNumber } from "@waves/data-entities";
import { // map,
  identity,
  always,
  map,
  path,
  chain,
  partition,
  flatten} from 'ramda';

import { tap } from "../../utils/tap";
import * as LRU from 'lru-cache';
import { AssetIdsPair,// , Transaction, ServiceSearch
RateInfo
       } from "../../types";
import { AppError, DbError } from "../../errorHandling";
// import { Monoid } from "../../types/monoid";
// import { concatAll } from "../../utils/fp";
// import { timeStart } from "utils/time";
import { PgDriver } from "db/driver";

import * as knex from 'knex'

import makeSql from './sql'

const pg = knex({ client: 'pg' });

const WavesId: string = 'WAVES';

type ReqAndRes<TReq, TRes> = {
  req: TReq,
  res: Maybe<TRes>
}

function maybeIsNone<T>(data: Maybe<T>): boolean {
  return data.matchWith(
    {
      Just: always(false),
      Nothing: always(true)
    }
  )
}

const maybeMap2 = <T1, T2, R>(fn: (v1: T1, v2: T2) => R, v1: Maybe<T1>, v2: Maybe<T2>): Maybe<R> =>
  v1.chain(v1 => v2.map(v2 => fn(v1, v2)))

type RateLookupTable = {
  [amountAsset: string]: {
    [priceAsset: string]: BigNumber
  }
};

function toLookupTable(data: RateInfo[]): RateLookupTable {
  return data.reduce(
    (acc, item) => {
      if (!(item.amountAsset in acc)) {
        acc[item.amountAsset] = {}
      }

      acc[item.amountAsset][item.priceAsset] = item.current;

      return acc
    },
    {} as RateLookupTable
  )
}

function safeDivide(n1: BigNumber, n2: BigNumber): Maybe<BigNumber> {
  return maybeOf(n2).filter(it => !it.isZero()).map(it => n1.div(it))
}

const inv = (n: BigNumber) => safeDivide(new BigNumber(1), n)

function lookupRate(pair: AssetIdsPair, lookup: RateLookupTable): Maybe<RateInfo> {
  let res: RateInfo;
  
  if (path([pair.amountAsset, pair.priceAsset], lookup) !== undefined) {
    res = {
      amountAsset: pair.amountAsset,
      priceAsset: pair.priceAsset,
      current: lookup[pair.amountAsset][pair.priceAsset]
    }
  } else if (path([pair.amountAsset, pair.priceAsset], lookup) !== undefined) {
    res = {
      amountAsset: pair.priceAsset,
      priceAsset: pair.amountAsset,
      current: inv(lookup[pair.priceAsset][pair.amountAsset]).getOrElse(new BigNumber(0))
    }
  } else {
    if (pair.amountAsset === WavesId || pair.priceAsset === WavesId) {
      return maybeEmpty()
    }

    return lookupThroughWaves(pair, lookup)
  }

  return maybeOf(res)
}

function lookupThroughWaves(pair: AssetIdsPair, lookup: RateLookupTable): Maybe<RateInfo> {
  return maybeMap2(
    (info1, info2) => safeDivide(info1.current, info2.current),
    lookupRate(
      {
        amountAsset: pair.amountAsset,
        priceAsset: WavesId
      },
      lookup
    ),
    lookupRate(
      {
        amountAsset: pair.priceAsset,
        priceAsset: WavesId
      },
      lookup
    )
  ).map(rate => (
    {
      amountAsset: pair.amountAsset,
      priceAsset: pair.priceAsset,
      current: rate.getOrElse(new BigNumber(0))
    }
  ))
}

export default class RateEstimator {
  constructor(
    // private readonly pairOrderingService: PairOrderingService,
    private readonly cache: LRU<string, BigNumber>,
    private readonly pgp: PgDriver
  ) {}

  estimate(assets: AssetIdsPair[], matcher: string, timestamp: Maybe<Date>): Task<AppError, ReqAndRes<AssetIdsPair, RateInfo>[]> {

    const keyFn = (amountAsset: string, priceAsset: string): string =>
      `${matcher}::${amountAsset}::${priceAsset}`

    const [eq, uneq] = partition(it => it.amountAsset === it.priceAsset, assets)

    const tuples = chain(it => [
      [it.amountAsset, it.priceAsset],
      [it.priceAsset, it.amountAsset],
      [it.amountAsset, WavesId],
      [WavesId, it.amountAsset],
      [it.priceAsset, WavesId],
      [WavesId, it.priceAsset]
    ], uneq);

    const [cached, uncached] = partition(
      it => this.cache.has(keyFn(it[0], it[1])),
      tuples
    )

    const cachedRates: RateInfo[] = cached.map(
      ([amountAsset, priceAsset]) => (
        {
          amountAsset,
          priceAsset,
          current: this.cache.get(keyFn(amountAsset, priceAsset))!!
        }
      )
    )

    const eqRates: RateInfo[] = eq.map(
      (pair) => (
        {
          current: new BigNumber(1),
          ...pair
        }
      )
    )

    console.log("CACHED: ", cached)

    // TODO: retrieve cached
    // TODO: retrieve it/it == 1

    const sql = pg.raw(makeSql(uncached.length), [timestamp.getOrElse(new Date()), matcher, ...flatten(uncached)])

    console.log(sql.toString())

    const cacheFn: (data: RateInfo[]) => void =
      maybeIsNone(timestamp) ? data => data.forEach(item => this.cache.set(keyFn(item.amountAsset, item.priceAsset), item.current)) : identity;

    const dbTask: Task<DbError, any[]> = uncached.length === 0 ? taskOf([]) : this.pgp.many(sql.toString());

    return dbTask.map(
      (result: any[]): RateInfo[] =>  map(
        (it: any): RateInfo => {
          return {
            amountAsset: it.amount_asset_id,
            priceAsset: it.price_asset_id,
            current: it.weighted_average_price
          }
        }, result)
    ).map(
      tap(cacheFn)
    ).map(
      data => toLookupTable(data.concat(eqRates).concat(cachedRates))
    ).map(
      tap(console.log)
    ).map(
      lookupTable => assets.map(
        idsPair => (
          {
            req: idsPair,
            res: lookupRate(idsPair, lookupTable)
          }
        )
      )
    )
  }
}
