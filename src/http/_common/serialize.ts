import { Maybe } from 'folktale/maybe';
import { Serializable, SearchedItems, list } from '../../types';
import { stringify } from '../../utils/json';
import { LSNFormat } from '../types';
import { HttpResponse } from './types';
import { contentTypeWithLSN } from './utils';

export const get = <T, Res extends Serializable<string, any>>(
  transform: (t: T | null) => Res,
  lsnFormat: LSNFormat = LSNFormat.String
) => (m: Maybe<T>): HttpResponse =>
  m.matchWith({
    Just: ({ value }) =>
      HttpResponse.Ok(stringify(lsnFormat)(transform(value))).withHeaders({
        'Content-Type': contentTypeWithLSN(lsnFormat),
      }),
    Nothing: () => HttpResponse.NotFound(),
  });

export const mget = <T, Res extends Serializable<string, any>>(
  transform: (t: T | null) => Res,
  lsnFormat: LSNFormat = LSNFormat.String
) => (ms: Maybe<T>[]): HttpResponse =>
  HttpResponse.Ok(
    stringify(lsnFormat)(
      ms.map(maybe =>
        maybe.matchWith({
          Just: ({ value }) => transform(value),
          Nothing: () => transform(null),
        })
      )
    )
  ).withHeaders({
    'Content-Type': contentTypeWithLSN(lsnFormat),
  });

export const search = <T, Res extends Serializable<string, any>>(
  transform: (t: T | null) => Res,
  lsnFormat: LSNFormat = LSNFormat.String
) => (data: SearchedItems<T>): HttpResponse =>
  HttpResponse.Ok(
    stringify(lsnFormat)(
      list(
        data.items.map(a => transform(a)),
        {
          isLastPage: data.isLastPage,
          lastCursor: data.lastCursor,
        }
      )
    )
  ).withHeaders({
    'Content-Type': contentTypeWithLSN(lsnFormat),
  });
