import * as knex from 'knex';
import { chain } from 'ramda';
import { Task, of as taskOf } from 'folktale/concurrency/task';
import { BigNumber } from '@waves/data-entities';

import { DbError, Timeout } from '../../../../errorHandling';
import { PgDriver } from '../../../../db/driver';
import { RateMgetParams, RateWithPairIds } from '../../../../types';
import { AsyncMget } from '../../repo';
import makeSql from './sql';

const pg = knex({ client: 'pg' });

type CandleRate = {
  amount_asset_id: string;
  price_asset_id: string;
  matcher: string;
  weighted_average_price: BigNumber;
};

export default class RemoteRateRepo
  implements AsyncMget<RateMgetParams, RateWithPairIds, DbError | Timeout> {
  constructor(private readonly dbDriver: PgDriver) {}

  mget(
    request: RateMgetParams
  ): Task<DbError | Timeout, Array<RateWithPairIds>> {
    const pairsSqlParams = chain(
      (it) => [it.amountAsset, it.priceAsset],
      request.pairs
    );

    const sql = pg.raw(makeSql(request.pairs.length), [
      request.timestamp.getOrElse(new Date()),
      request.matcher,
      ...pairsSqlParams,
    ]);

    const dbTask: Task<DbError | Timeout, CandleRate[]> =
      request.pairs.length === 0
        ? taskOf([])
        : this.dbDriver.any(sql.toString());

    return dbTask.map((result) =>
      result.map((it) => ({
        amountAsset: it.amount_asset_id,
        priceAsset: it.price_asset_id,
        // `|| new BigNumber(0)` — fix/workaround of 26.08.2021 incident
        // To reproduce, remove and try a pair `FaCgK3UfvkRF2WfFyKZRVasMmqPRoLG7nUv8HzR451dm/WAVES`
        // with timestamp `2021-08-25T15:00:00`
        rate: it.weighted_average_price || new BigNumber(0),
      }))
    );
  }
}
