import { Task, of as taskOf } from "folktale/concurrency/task";
import { Maybe, of as maybeOf } from 'folktale/maybe';

import { BigNumber } from "@waves/data-entities";
import {
  identity,
  uniqWith,
  map,
  chain,
  partition,
} from 'ramda';

import { tap } from "../../utils/tap";
import * as LRU from 'lru-cache';
import { AssetIdsPair, RateInfo } from "../../types";
import { AppError, DbError } from "../../errorHandling";
import { PgDriver } from "db/driver";
import * as knex from 'knex'

import makeSql from './sql';
import { RateCache, RateInfoLookup, RateCacheKey } from './repo';
import { WavesId, pairIsSymmetric, flip } from './data';
import { maybeIsNone } from "./util";

const pg = knex({ client: 'pg' });

type ReqAndRes<TReq, TRes> = {
  req: TReq,
  res: Maybe<TRes>
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

const pairsEq = (pair1: AssetIdsPair, pair2: AssetIdsPair): boolean =>
  pair1.amountAsset === pair2.amountAsset && pair1.priceAsset === pair2.priceAsset

type PairsForRequest = {
  preCount: RateInfo[],
  toBeRequested: AssetIdsPair[]
}

const partitionByPreCount = (cache: RateCache, pairs: AssetIdsPair[], getCacheKey: (pair: AssetIdsPair) => Maybe<RateCacheKey>): PairsForRequest => {
  const [eq, uneq] = partition(pairIsSymmetric, pairs)

  const allPairsToRequest = uniqWith(
    pairsEq,
    chain(it => requestData(it), uneq)
  )

  const [cached, uncached] = partition(
    it => cache.has(
      getCacheKey(it)
    ),
    allPairsToRequest
  )

  const cachedRates: RateInfo[] = cached.map(
    pair => (
      {
        amountAsset: pair.amountAsset,
        priceAsset: pair.priceAsset,
        current: cache.get(
          getCacheKey(pair)
        ).getOrElse(new BigNumber(0))
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
  private readonly cache: RateCache
  
  constructor(
    lru: LRU<string, BigNumber>,
    private readonly pgp: PgDriver
  ) {

    this.cache = new RateCache(lru)
  }

  estimate(pairs: AssetIdsPair[], matcher: string, timestamp: Maybe<Date>): Task<AppError, ReqAndRes<AssetIdsPair, RateInfo>[]> {
    const shouldCache = maybeIsNone(timestamp)

    const getCacheKey = (pair: AssetIdsPair): Maybe<RateCacheKey> =>
      maybeOf(shouldCache).filter(identity).map(
        () => (
          {
            pair, matcher
          })
      );
    
    const cacheAll = (items: RateInfo[]) => items.forEach(
      it => this.cache.put(getCacheKey(it), it.current)
    )
    
    const { preCount, toBeRequested } = partitionByPreCount(this.cache, pairs, getCacheKey)

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
      data => new RateInfoLookup(data.concat(preCount))
    ).map(
      lookup => pairs.map(
        idsPair => (
          {
            req: idsPair,
            res: lookup.get(idsPair)
          }
        )
      )
    ).map(
      tap(
        data => data.forEach(
          reqAndRes => reqAndRes.res.map(
            tap(res => this.cache.put(getCacheKey(reqAndRes.req), res.current))
          )
        )
      )
    )
  }
}
