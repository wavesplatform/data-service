import { Maybe } from 'folktale/maybe';
import { Serializable, SearchedItems, list } from '../../types';
import { DEFAULT_NOT_FOUND_MESSAGE } from '../../errorHandling';
import { HttpResponse } from './types';
import { toHttpResponse } from './utils';

export const get = <T, Res extends Serializable<string, T>>(
  transform: (t: T | null) => Res
) => (m: Maybe<T>): HttpResponse =>
  m.matchWith({
    Just: ({ value }) =>
      toHttpResponse({
        status: 200,
        body: transform(value),
      }),
    Nothing: () =>
      toHttpResponse({
        status: 404,
        body: {
          message: DEFAULT_NOT_FOUND_MESSAGE,
        } as any,
      }),
  });

export const mget = <T, Res extends Serializable<string, T>>(
  transform: (t: T | null) => Res
) => (ms: Maybe<T>[]): HttpResponse =>
  toHttpResponse({
    status: 200,
    body: ms.map(maybe =>
      maybe.matchWith({
        Just: ({ value }) => transform(value),
        Nothing: () => transform(null),
      })
    ),
  });

export const search = <T, Res extends Serializable<string, T>>(
  transform: (t: T | null) => Res
) => (data: SearchedItems<T>): HttpResponse =>
  toHttpResponse({
    status: 200,
    body: list(
      data.items.map(a => transform(a)),
      {
        isLastPage: data.isLastPage,
        lastCursor: data.lastCursor,
      }
    ),
  });
