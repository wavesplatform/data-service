import * as knex from 'knex';
import { chain, map } from 'ramda';
import { Task, of as taskOf } from 'folktale/concurrency/task';

import { DbError } from '../../../../errorHandling';
import { PgDriver } from '../../../../db/driver';
import { AsyncMget } from '../../repo';
import { RateMgetParams } from '../../../../types';
import makeSql from './sql';
import { RateWithPairIds } from '../../../rates';

const pg = knex({ client: 'pg' });

export default class RemoteRateRepo
  implements AsyncMget<RateMgetParams, RateWithPairIds, DbError> {
  constructor(private readonly dbDriver: PgDriver) {}

  mget(request: RateMgetParams): Task<DbError, Array<RateWithPairIds>> {
    const pairsSqlParams = chain(
      it => [it.amountAsset, it.priceAsset],
      request.pairs
    );

    const sql = pg.raw(makeSql(request.pairs.length), [
      request.timestamp.getOrElse(new Date()),
      request.matcher,
      ...pairsSqlParams,
    ]);

    const dbTask: Task<DbError, any[]> =
      request.pairs.length === 0
        ? taskOf([])
        : this.dbDriver.any(sql.toString());

    return dbTask.map((result: any[]): Array<RateWithPairIds> =>
      map((it: any): RateWithPairIds => {
        return {
          amountAsset: it.amount_asset_id,
          priceAsset: it.price_asset_id,
          rate: it.weighted_average_price,
        };
      }, result)
    );
  }
}
