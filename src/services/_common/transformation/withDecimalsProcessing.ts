import { Task, of as taskOf } from 'folktale/concurrency/task';
import { empty, Maybe, of as maybeOf } from 'folktale/maybe';
import { sequence } from 'ramda';
import { AppError } from '../../../errorHandling';
import { SearchedItems } from '../../../types';
import { swapMaybeF } from '../../../utils/fp';
import { DecimalsFormat, WithDecimalsFormat } from '../../types';

export const getWithDecimalsProcessing = <
  GetRequest extends WithDecimalsFormat,
  Response
>(
  modifyDecimals: (items: Response[]) => Task<AppError, Response[]>,
  get: (r: GetRequest) => Task<AppError, Maybe<Response>>
) => (req: GetRequest) =>
  get(req).chain<AppError, Maybe<Response>>((m) =>
    req.decimalsFormat == DecimalsFormat.Long
      ? taskOf<AppError, Maybe<Response>>(m)
      : swapMaybeF<AppError, Response>(
          taskOf,
          m.map((item) => modifyDecimals([item]).map((res) => res[0]))
        )
  );

export const mgetWithDecimalsProcessing = <
  MgetRequest extends WithDecimalsFormat,
  Response
>(
  modifyDecimals: (items: Response[]) => Task<AppError, Response[]>,
  mget: (r: MgetRequest) => Task<AppError, Maybe<Response>[]>
) => (req: MgetRequest) =>
  mget(req).chain<AppError, Maybe<Response>[]>((ms) =>
    req.decimalsFormat == DecimalsFormat.Long
      ? taskOf(ms)
      : swapMaybeF<AppError, Response[]>(
          taskOf,
          sequence<Maybe<Response>, Maybe<Response[]>>(maybeOf, ms).map(
            modifyDecimals
          )
        ).map((m) =>
          m.matchWith({
            Just: ({ value: txs }) => txs.map(maybeOf),
            Nothing: () => [empty()],
          })
        )
  );

export const searchWithDecimalsProcessing = <
  SearchRequest extends WithDecimalsFormat,
  Response
>(
  modifyDecimals: (items: Response[]) => Task<AppError, Response[]>,
  search: (r: SearchRequest) => Task<AppError, SearchedItems<Response>>
) => (req: SearchRequest) =>
  search(req).chain<AppError, SearchedItems<Response>>((res) =>
    req.decimalsFormat == DecimalsFormat.Long
      ? taskOf(res)
      : modifyDecimals(res.items).map((items) => ({
          ...res,
          items,
        }))
  );

export const withDecimalsProcessing = <
  GetRequest extends WithDecimalsFormat,
  MgetRequest extends WithDecimalsFormat,
  SearchRequest extends WithDecimalsFormat,
  Response
>(
  modifyDecimals: (items: Response[]) => Task<AppError, Response[]>,
  service: {
    get: (r: GetRequest) => Task<AppError, Maybe<Response>>;
    mget: (r: MgetRequest) => Task<AppError, Maybe<Response>[]>;
    search: (r: SearchRequest) => Task<AppError, SearchedItems<Response>>;
  }
): {
  get: (r: GetRequest) => Task<AppError, Maybe<Response>>;
  mget: (r: MgetRequest) => Task<AppError, Maybe<Response>[]>;
  search: (r: SearchRequest) => Task<AppError, SearchedItems<Response>>;
} => ({
  get: getWithDecimalsProcessing(modifyDecimals, service.get),
  mget: mgetWithDecimalsProcessing(modifyDecimals, service.mget),
  search: searchWithDecimalsProcessing(modifyDecimals, service.search),
});
