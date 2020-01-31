import { Maybe } from 'folktale/maybe';
import { Serializable, SearchedItems, list } from '../../types';
import { DEFAULT_NOT_FOUND_MESSAGE } from '../../errorHandling';
import { HttpResponse } from './types';
import { defaultStringify } from './utils';

export const get = <T, Res extends Serializable<string, T>>(
  transform: (t: T | null) => Res
) => (m: Maybe<T>): HttpResponse =>
  m.matchWith({
    Just: ({ value }) => ({
      status: 200,
      body: defaultStringify(transform(value)),
    }),
    Nothing: () => ({
      status: 404,
      body: defaultStringify({
        message: DEFAULT_NOT_FOUND_MESSAGE,
      }),
    }),
  });

export const mget = <T, Res extends Serializable<string, T>>(
  transform: (t: T | null) => Res
) => (ms: Maybe<T>[]): HttpResponse => ({
  status: 200,
  body: defaultStringify(
    ms.map(maybe =>
      maybe.matchWith({
        Just: ({ value }) => transform(value),
        Nothing: () => transform(null),
      })
    )
  ),
});

export const search = <T, Res extends Serializable<string, T>>(
  transform: (t: T | null) => Res
) => (data: SearchedItems<T>): HttpResponse => ({
  status: 200,
  body: defaultStringify(
    list(
      data.items.map(a => transform(a)),
      {
        isLastPage: data.isLastPage,
        lastCursor: data.lastCursor,
      }
    )
  ),
});
