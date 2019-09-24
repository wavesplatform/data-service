import { Task } from 'folktale/concurrency/task';
import { identity } from 'ramda';

import { Candle, List, ServiceSearch, AssetIdsPair } from '../../types';

import { CommonServiceDependencies } from '..';

import { sql } from './sql';
import { inputSearch, output } from './schema';
import { CandleDbResponse, transformResults } from './transformResults';

import { AppError } from '../../errorHandling';

import { validateInput, validateResult } from '../presets/validation';
import { getData } from '../presets/pg/search/pg';

import { search } from './../_common/createResolver/index';

export type CandlesSearchRequest = {
  amountAsset: string;
  priceAsset: string;
  timeStart: Date;
  timeEnd: Date;
  interval: string;
  matcher: string;
};

export type CandlesService = ServiceSearch<CandlesSearchRequest, Candle>;

export default ({
  drivers: { pg },
  emitEvent,
  validatePair,
}: CommonServiceDependencies & {
  validatePair: (matcher: string, pair: AssetIdsPair) => Task<AppError, void>;
}): CandlesService => {
  const SERVICE_NAME = 'candles.search';
  return {
    search: search<
      CandlesSearchRequest,
      CandlesSearchRequest,
      CandleDbResponse,
      List<Candle>
    >({
      transformInput: identity,
      transformResult: transformResults,
      validateInput: req =>
        validateInput<CandlesSearchRequest>(inputSearch, SERVICE_NAME)(
          req
        ).chain(() =>
          validatePair(req.matcher, {
            amountAsset: req.amountAsset,
            priceAsset: req.priceAsset,
          }).map(() => req)
        ),
      validateResult: validateResult(output, SERVICE_NAME),
      getData: getData({ name: SERVICE_NAME, sql, pg }),
      emitEvent,
    }),
  };
};
