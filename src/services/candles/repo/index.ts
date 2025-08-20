import { Ok as ok } from 'folktale/result';

import { CandleInfo, Interval, RepoSearch, RepoSearchResponse } from '../../../types';
import { CommonRepoDependencies } from '../..';

import { sql } from './sql';
import { output } from './schema';
import { transformResults, transformLastResult } from './transformResults';

import { validateResult } from '../../_common/presets/validation';
import { getData } from '../../_common/presets/pg/search/pg';

import { search } from '../../_common/createResolver';
import { Task } from 'folktale/concurrency/task';
import { AppError } from '../../../errorHandling';

export type CandlesSearchRequest = {
  amountAsset: string;
  priceAsset: string;
  timeStart: Date;
  timeEnd: Date;
  interval: Interval;
  matcher: string;
};

export type RepoSearchLast<Request, Response> = {
  readonly searchLast: (request: Request) => Task<AppError, RepoSearchResponse<Response>>;
};

export type CandlesRepo =
  RepoSearch<CandlesSearchRequest, CandleInfo> &
  RepoSearchLast<CandlesSearchRequest, CandleInfo>;

export default ({ drivers: { pg }, emitEvent }: CommonRepoDependencies): CandlesRepo => {
  const SERVICE__SEARCH__NAME = 'candles.search';
  const SERVICE__SEARCH_LAST__NAME = 'candles.search_last';
  return {
    search: search({
      transformInput: ok,
      transformResult: transformResults,
      validateResult: validateResult(output, SERVICE__SEARCH__NAME),
      getData: getData({
        name: SERVICE__SEARCH__NAME,
        sql: sql.search,
        pg,
      }),
      emitEvent,
    }),
    searchLast: search({
      transformInput: ok,
      transformResult: transformLastResult,
      validateResult: validateResult(output, SERVICE__SEARCH_LAST__NAME),
      getData: getData({
        name: SERVICE__SEARCH_LAST__NAME,
        sql: sql.searchLast,
        pg,
      }),
      emitEvent,
    }),
  };
};
