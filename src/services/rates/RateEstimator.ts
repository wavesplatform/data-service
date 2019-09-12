import { Task, of as taskOf } from "folktale/concurrency/task";
import { Maybe, of as maybeOf } from 'folktale/maybe';

import {
  identity,
  map,
  chain,
} from 'ramda';

import { tap } from "../../utils/tap";
import { AssetIdsPair, RateInfo } from "../../types";
import { AppError, DbError } from "../../errorHandling";
import { PgDriver } from "db/driver";
import * as knex from 'knex'

import makeSql from './sql';
import { partitionByPreCount } from './repo';
import  RateCache, { RateCacheKey } from './repo/impl/RateCache';
import RateInfoLookup from './repo/impl/RateInfoLookup'
import { maybeIsNone } from "./util";

const pg = knex({ client: 'pg' });

type ReqAndRes<TReq, TRes> = {
  req: TReq,
  res: Maybe<TRes>
}

export default class RateEstimator {
  constructor(
    private readonly cache: RateCache,
    private readonly pgp: PgDriver
  ) { }

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
