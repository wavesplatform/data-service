import * as knex from 'knex';
import { chain, map } from 'ramda';
import { Maybe } from 'folktale/maybe';
import { Task, of as taskOf } from "folktale/concurrency/task";

import { DbError } from "../../../../errorHandling";
import { PgDriver } from "../../../../db/driver";
import { AsyncGet } from '../../repo';
import { AssetIdsPair, RateInfo } from "../../../../types";
import makeSql from './sql';

export type RemoteRequestParams = {
  pairs: AssetIdsPair[],
  matcher: string,
  timestamp: Maybe<Date>
};

const pg = knex({ client: 'pg' });

export default class RemoteRateRepo implements AsyncGet<RemoteRequestParams, RateInfo[], DbError> {

  constructor(
    private readonly pgp: PgDriver
  ) { }

  get(request: RemoteRequestParams): Task<DbError, RateInfo[]> {
    const pairsSqlParams = chain(it => [it.amountAsset, it.priceAsset], request.pairs)

    const sql = pg.raw(makeSql(request.pairs.length), [ request.timestamp.getOrElse(new Date()), request.matcher, ...pairsSqlParams ])

    // console.log(sql.toString())

    const dbTask: Task<DbError, any[]> = request.pairs.length === 0 ? taskOf([]) : this.pgp.any(sql.toString());

    return dbTask.map(
      (result: any[]): RateInfo[] => map(
        (it: any): RateInfo => {
          return {
            amountAsset: it.amount_asset_id,
            priceAsset: it.price_asset_id,
            current: it.weighted_average_price
          }
        }, result)
    )
  }
}
