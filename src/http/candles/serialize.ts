import { SearchedItems, CandleInfo, candle, list } from '../../types';
import { stringify } from '../../utils/json';
import { HttpResponse } from '../_common/types';
import { LSNFormat } from '../types';

export const serialize = (
  data: SearchedItems<CandleInfo>,
  lsnFormat: LSNFormat
): HttpResponse => {
  if (data.items.length) {
    return HttpResponse.Ok(
      stringify(lsnFormat)(
        list(
          data.items.map(a => candle(a)),
          {
            isLastPage: data.isLastPage,
            lastCursor: data.lastCursor,
          }
        )
      )
    );
  } else {
    return HttpResponse.NotFound();
  }
};
