import { Maybe } from 'folktale/maybe';
import { Serializable, SearchedItems, list } from '../../types';
import { stringify } from '../../utils/json';
import { LSNFormat } from '../types';
import { HttpResponse } from './types';
import { contentTypeWithLSN } from './utils';

export const get = <T extends R, Res extends Serializable<string, R | null>, R = T>(
  toSerializable: (t: T | null) => Res,
  lsnFormat: LSNFormat = LSNFormat.String
) => (m: Maybe<T>): HttpResponse =>
  m.matchWith({
    Just: ({ value }) =>
      HttpResponse.Ok(stringify(lsnFormat)(toSerializable(value))).withHeaders({
        'Content-Type': contentTypeWithLSN(lsnFormat),
      }),
    Nothing: () => HttpResponse.NotFound(),
  });

export const mget = <T extends R, Res extends Serializable<string, R | null>, R = T>(
  toSerializable: (t: T | null) => Res,
  lsnFormat: LSNFormat = LSNFormat.String
) => (ms: Maybe<T>[]): HttpResponse =>
  HttpResponse.Ok(
    stringify(lsnFormat)(
      list(
        ms.map(maybe =>
          maybe.matchWith({
            Just: ({ value }) => toSerializable(value),
            Nothing: () => toSerializable(null),
          })
        )
      )
    )
  ).withHeaders({
    'Content-Type': contentTypeWithLSN(lsnFormat),
  });

export const search = <T extends R, Res extends Serializable<string, R | null>, R = T>(
  toSerializable: (t: T | null) => Res,
  lsnFormat: LSNFormat = LSNFormat.String
) => (data: SearchedItems<T>): HttpResponse =>
  HttpResponse.Ok(
    stringify(lsnFormat)(
      list(
        data.items.map(a => toSerializable(a)),
        {
          isLastPage: data.isLastPage,
          lastCursor: data.lastCursor,
        }
      )
    )
  ).withHeaders({
    'Content-Type': contentTypeWithLSN(lsnFormat),
  });
