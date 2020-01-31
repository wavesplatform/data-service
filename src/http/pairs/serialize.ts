import { Maybe } from 'folktale/maybe';
import { PairInfo, pair, SearchedItems, list } from '../../types';
import { HttpResponse } from '../_common/types';
import { stringify } from '../../utils/json';
import { LSNFormat } from '../../http/types';

export const get = (m: Maybe<PairInfo>, lsnFormat: LSNFormat): HttpResponse =>
  m.matchWith({
    Just: ({ value: p }) =>
      HttpResponse.Ok(stringify(lsnFormat)(pair(p, null))),
    Nothing: () => HttpResponse.NotFound(),
  });

export const mget = (
  ms: Maybe<PairInfo>[],
  lsnFormat: LSNFormat
): HttpResponse =>
  HttpResponse.Ok(
    stringify(lsnFormat)(ms.map(m => pair(m.getOrElse(null), null)))
  );

export const search = (
  data: SearchedItems<PairInfo>,
  lsnFormat: LSNFormat
): HttpResponse =>
  HttpResponse.Ok(
    stringify(lsnFormat)(
      list(
        data.items.map(a => pair(a, null)),
        {
          isLastPage: data.isLastPage,
          lastCursor: data.lastCursor,
        }
      )
    )
  );
