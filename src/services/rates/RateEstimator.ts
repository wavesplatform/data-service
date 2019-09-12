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
  map,
  path,
  chain,
  partition,
} from 'ramda';

import { tap } from "../../utils/tap";
import * as LRU from 'lru-cache';
import { AssetIdsPair, RateInfo } from "../../types";
import { AppError, DbError } from "../../errorHandling";
import { PgDriver } from "db/driver";
import * as knex from 'knex'

import makeSql from './sql'
import { inv, maybeMap2, safeDivide, maybeIsSome }  from './util'

const pg = knex({ client: 'pg' });

const WavesId: string = 'WAVES';

type ReqAndRes<TReq, TRes> = {
  req: TReq,
  res: Maybe<TRes>
}

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

function getFromLookupTable(lookup: RateLookupTable, pair: AssetIdsPair, flipped: boolean): Maybe<RateInfo> {
  const lookupData = flipped ? flip(pair) : pair

  return fromNullable(path([lookupData.amountAsset, lookupData.priceAsset], lookup))
    .map((rate: BigNumber) => flipped ? inv(rate).getOrElse(new BigNumber(0)) : rate)
    .map(
      rate => (
        {
          current: rate,
            ...lookupData           
        }
      )
    )
}

const pairHasWaves = (pair: AssetIdsPair): boolean => pair.priceAsset === WavesId || pair.amountAsset === WavesId;

function lookupRate(pair: AssetIdsPair, lookupTable: RateLookupTable): Maybe<RateInfo> {
  const lookup = (pair: AssetIdsPair, flipped: boolean) => getFromLookupTable(lookupTable, pair, flipped)

  return lookup(pair, false)
    .orElse(
      () => lookup(pair, true)
    ).orElse(
      () => maybeOf(pair).filter(complement(pairHasWaves)).chain(pair => lookupThroughWaves(pair, lookupTable))
    )
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

function wrapCache(cache: LRU<string, BigNumber>, matcher: string, params: { muted: boolean }): RateCache {
  const keyFn = (pair: AssetIdsPair): string =>
    `${matcher}::${pair.amountAsset}::${pair.priceAsset}`

  const muted = params.muted
  
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

type PairsForRequest = {
  preCount: RateInfo[],
  toBeRequested: AssetIdsPair[]
}

const partitionByPreCount = (cache: RateCache, pairs: AssetIdsPair[]): PairsForRequest => {
  const [eq, uneq] = partition(it => it.amountAsset === it.priceAsset, pairs)

  const allPairsToRequest = uniqWith(
    pairsEq,
    chain(it => requestData(it), uneq)
  )

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

  const eqRates: RateInfo[] = eq.map(
    (pair) => (
      {
        current: new BigNumber(1),
          ...pair
      }
    )
  )

  return {
    preCount: cachedRates.concat(eqRates),
    toBeRequested: uncached
  }
}

export default class RateEstimator {
  constructor(
    private readonly lru: LRU<string, BigNumber>,
    private readonly pgp: PgDriver
  ) {}

  estimate(pairs: AssetIdsPair[], matcher: string, timestamp: Maybe<Date>): Task<AppError, ReqAndRes<AssetIdsPair, RateInfo>[]> {

    const cache = wrapCache(this.lru, matcher, { muted: maybeIsSome(timestamp) })
    
    const cacheAll = (items: RateInfo[]) => items.forEach(it => cache.put(it, it.current))

    const { preCount, toBeRequested } = partitionByPreCount(cache, pairs)

    const pairsSqlParams = chain(it => [it.amountAsset, it.priceAsset], toBeRequested)

    const sql = pg.raw(makeSql(toBeRequested.length), [ timestamp.getOrElse(new Date()), matcher, ...pairsSqlParams ])

    // console.log(sql.toString())

    const dbTask: Task<DbError, any[]> = toBeRequested.length === 0 ? taskOf([]) : this.pgp.any(sql.toString());

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
      data => toLookupTable(data.concat(preCount))
    ).map(
      lookupTable => pairs.map(
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
