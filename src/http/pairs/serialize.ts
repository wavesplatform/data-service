import { Maybe } from 'folktale/maybe';
import { DEFAULT_NOT_FOUND_MESSAGE } from '../../errorHandling';
import { PairInfo, pair, SearchedItems, list } from '../../types';
import { HttpResponse } from '../_common/types';
import { defaultStringify } from '../../http/_common/utils';
import { stringify } from '../../utils/json';
import { LSNFormat } from '../../http/types';

export const get = (m: Maybe<PairInfo>, lsnFormat: LSNFormat): HttpResponse =>
  m.matchWith({
    Just: ({ value: p }) => ({
      status: 200,
      body: stringify(lsnFormat)(pair(p, null)),
    }),
    Nothing: () => ({
      status: 404,
      body: defaultStringify({
        message: DEFAULT_NOT_FOUND_MESSAGE,
      }),
    }),
  });

export const mget = (
  ms: Maybe<PairInfo>[],
  lsnFormat: LSNFormat
): HttpResponse => ({
  status: 200,
  body: stringify(lsnFormat)(ms.map(m => pair(m.getOrElse(null), null))),
});

export const search = (
  data: SearchedItems<PairInfo>,
  lsnFormat: LSNFormat
): HttpResponse => ({
  status: 200,
  body: stringify(lsnFormat)(
    list(
      data.items.map(a => pair(a, null)),
      {
        isLastPage: data.isLastPage,
        lastCursor: data.lastCursor,
      }
    )
  ),
});
