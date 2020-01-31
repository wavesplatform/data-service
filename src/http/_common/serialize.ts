import { Maybe } from 'folktale/maybe';
import { Serializable, SearchedItems, list } from '../../types';
import { HttpResponse } from './types';
import { defaultStringify } from './utils';

export const get = <T, Res extends Serializable<string, T>>(
  transform: (t: T | null) => Res
) => (m: Maybe<T>): HttpResponse =>
  m.matchWith({
    Just: ({ value }) => HttpResponse.Ok(defaultStringify(transform(value))),
    Nothing: () => HttpResponse.NotFound(),
  });

export const mget = <T, Res extends Serializable<string, T>>(
  transform: (t: T | null) => Res
) => (ms: Maybe<T>[]): HttpResponse =>
  HttpResponse.Ok(
    defaultStringify(
      ms.map(maybe =>
        maybe.matchWith({
          Just: ({ value }) => transform(value),
          Nothing: () => transform(null),
        })
      )
    )
  );

export const search = <T, Res extends Serializable<string, T>>(
  transform: (t: T | null) => Res
) => (data: SearchedItems<T>): HttpResponse =>
  HttpResponse.Ok(
    defaultStringify(
      list(
        data.items.map(a => transform(a)),
        {
          isLastPage: data.isLastPage,
          lastCursor: data.lastCursor,
        }
      )
    )
  );
