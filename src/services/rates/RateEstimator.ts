import { Task, of as taskOf } from "folktale/concurrency/task";
import { Maybe,
         fromNullable,
         of as maybeOf,
         empty as maybeEmpty,
       } from 'folktale/maybe';

import { BigNumber } from "@waves/data-entities";
import {
  uniqWith,
  complement,
  always,
  map,
  path,
  chain,
  partition,
} from 'ramda';

import { tap } from "../../utils/tap";
import * as LRU from 'lru-cache';
import { AssetIdsPair, RateInfo } from "../../types";
import { AppError, DbError } from "../../errorHandling";
// import { Monoid } from "../../types/monoid";
// import { concatAll } from "../../utils/fp";
import { PgDriver } from "db/driver";

import * as knex from 'knex'

import makeSql from './sql'

const pg = knex({ client: 'pg' });

const WavesId: string = 'WAVES';

type ReqAndRes<TReq, TRes> = {
  req: TReq,
  res: Maybe<TRes>
}

const maybeIsNone = <T>(data: Maybe<T>) => {
  return data.matchWith(
    {
      Just: always(false),
      Nothing: always(true)
    }
  )
}

const maybeIsSome = complement(maybeIsNone)

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
  } else if (path([pair.priceAsset, pair.amountAsset], lookup) !== undefined) {
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

function flip(pair: AssetIdsPair): AssetIdsPair {
  return {
    amountAsset: pair.priceAsset,
    priceAsset: pair.amountAsset
  }
}

function requestData(pair: AssetIdsPair): AssetIdsPair[] {
  if (pair.amountAsset === WavesId || pair.priceAsset === WavesId) {
    return [pair, flip(pair)]
  }

  const wavesL: AssetIdsPair = {
    amountAsset: pair.amountAsset,
    priceAsset: WavesId
  }

  const wavesR: AssetIdsPair = {
    amountAsset: pair.priceAsset,
    priceAsset: WavesId
  }

  return [
    pair, flip(pair),
    wavesL, flip(wavesL),
    wavesR, flip(wavesR)
  ]
}

type RateCache = {
  has: (pair: AssetIdsPair) => boolean,
  put: (pair: AssetIdsPair, rate: BigNumber) => void,
  get: (pair: AssetIdsPair) => Maybe<BigNumber>
}

function wrapCache(cache: LRU<string, BigNumber>, matcher: string, muted: boolean = false): RateCache {
  const keyFn = (pair: AssetIdsPair): string =>
    `${matcher}::${pair.amountAsset}::${pair.priceAsset}`
  
  return {
    has: (pair: AssetIdsPair) => !muted && (cache.has(keyFn(pair)) || cache.has(keyFn(flip(pair)))),
    put: (pair: AssetIdsPair, rate: BigNumber) => {
      if (!muted) {
        cache.set(keyFn(pair), rate)
      }
    },
    get: (pair: AssetIdsPair) => {
      if (muted) {
        return maybeEmpty()
      } else {
        return fromNullable(cache.get(keyFn(pair))).orElse(
          () => fromNullable(cache.get(keyFn(flip(pair)))).chain(inv)
        )
      }
    }
  }
}

const pairsEq = (pair1: AssetIdsPair, pair2: AssetIdsPair): boolean =>
  pair1.amountAsset === pair2.amountAsset && pair1.priceAsset === pair2.priceAsset

export default class RateEstimator {
  constructor(
    // private readonly pairOrderingService: PairOrderingService,
    private readonly lru: LRU<string, BigNumber>,
    private readonly pgp: PgDriver
  ) {}

  estimate(assets: AssetIdsPair[], matcher: string, timestamp: Maybe<Date>): Task<AppError, ReqAndRes<AssetIdsPair, RateInfo>[]> {

    const cache = wrapCache(this.lru, matcher, maybeIsSome(timestamp))
    
    const cacheAll = (items: RateInfo[]) => items.forEach(it => cache.put(it, it.current))
    
    const [eq, uneq] = partition(it => it.amountAsset === it.priceAsset, assets)

    console.log("UNEQ LEN: ", uneq.length)

    const allPairsToRequest = uniqWith(
      pairsEq,
      chain(it => requestData(it), uneq)
    )

    console.log("ALL PAIRS TO REQUEST:", allPairsToRequest.length)

    const [cached, uncached] = partition(
      it => cache.has(it),
      allPairsToRequest
    )

    const cachedRates: RateInfo[] = cached.map(
      pair => (
        {
          amountAsset: pair.amountAsset,
          priceAsset: pair.priceAsset,
          current: cache.get(pair).getOrElse(new BigNumber(0))
        }
      )
    )

    console.log("UNCACHED:::", uncached)

    const eqRates: RateInfo[] = eq.map(
      (pair) => (
        {
          current: new BigNumber(1),
          ...pair
        }
      )
    )

    const pairsSqlParams = chain(it => [it.amountAsset, it.priceAsset],uncached)

    const sql = pg.raw(makeSql(uncached.length), [timestamp.getOrElse(new Date()), matcher, ...pairsSqlParams])

    console.log(sql.toString())

    const dbTask: Task<DbError, any[]> = uncached.length === 0 ? taskOf([]) : this.pgp.any(sql.toString());

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
      tap(cacheAll)
    ).map(
      data => toLookupTable(data.concat(eqRates).concat(cachedRates))
    ).map(tap(console.log))
      .map(
      lookupTable => assets.map(
        idsPair => (
          {
            req: idsPair,
            res: lookupRate(idsPair, lookupTable)
          }
        )
      )
    ).map(
      tap(
        data => data.forEach(
          reqAndRes => reqAndRes.res.map(
            tap(res => cache.put(reqAndRes.req, res.current))
          )
        )
      )
    )
  }
}
