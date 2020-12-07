import { Task, of as taskOf } from 'folktale/concurrency/task';
import { empty, Maybe, of as maybeOf } from 'folktale/maybe';
import { AppError } from '../../../errorHandling';
import { SearchedItems } from '../../../types';
import { swapMaybeF } from '../../../utils/fp';
import { MoneyFormat, WithMoneyFormat } from '../../types';

export const getWithDecimalsProcessing = <
  GetRequest extends WithMoneyFormat,
  Response
>(
  modifyDecimals: (items: Response[]) => Task<AppError, Response[]>,
  get: (r: GetRequest) => Task<AppError, Maybe<Response>>
) => (req: GetRequest) =>
  get(req).chain<AppError, Maybe<Response>>((m) =>
    req.moneyFormat == MoneyFormat.Long
      ? taskOf<AppError, Maybe<Response>>(m)
      : swapMaybeF<AppError, Response>(
          taskOf,
          m.map((item) => modifyDecimals([item]).map((res) => res[0]))
        )
  );

export const mgetWithDecimalsProcessing = <
  MgetRequest extends WithMoneyFormat,
  Response
>(
  modifyDecimals: (items: Response[]) => Task<AppError, Response[]>,
  mget: (r: MgetRequest) => Task<AppError, Maybe<Response>[]>
) => (req: MgetRequest) =>
  mget(req).chain<AppError, Maybe<Response>[]>((ms) =>
    req.moneyFormat == MoneyFormat.Long
      ? taskOf(ms)
      : modifyDecimals(
          ms
            .filter((m) =>
              m.matchWith({
                Just: () => true,
                Nothing: () => false,
              })
            )
            .map((m) => m.unsafeGet())
        ).map((res) => {
          let idx = 0;
          return ms.map((m) =>
            m.matchWith({
              Just: (_) => maybeOf(res[idx++]),
              Nothing: () => empty(),
            })
          );
        })
  );

export const searchWithDecimalsProcessing = <
  SearchRequest extends WithMoneyFormat,
  Response
>(
  modifyDecimals: (items: Response[]) => Task<AppError, Response[]>,
  search: (r: SearchRequest) => Task<AppError, SearchedItems<Response>>
) => (req: SearchRequest) =>
  search(req).chain<AppError, SearchedItems<Response>>((res) =>
    req.moneyFormat == MoneyFormat.Long
      ? taskOf(res)
      : modifyDecimals(res.items).map((items) => ({
          ...res,
          items,
        }))
  );

export const withDecimalsProcessing = <
  GetRequest extends WithMoneyFormat,
  MgetRequest extends WithMoneyFormat,
  SearchRequest extends WithMoneyFormat,
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
