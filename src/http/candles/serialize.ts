import { DEFAULT_NOT_FOUND_MESSAGE } from '../../errorHandling';
import { SearchedItems, CandleInfo, candle, list } from '../../types';
import { stringify } from '../../utils/json';
import { HttpResponse } from '../_common/types';
import { defaultStringify } from '../_common/utils';
import { LSNFormat } from '../types';

export const serialize = (
  data: SearchedItems<CandleInfo>,
  lsnFormat: LSNFormat
): HttpResponse => {
  if (data.items.length) {
    return {
      status: 200,
      body: stringify(lsnFormat)(
        list(
          data.items.map(a => candle(a)),
          {
            isLastPage: data.isLastPage,
            lastCursor: data.lastCursor,
          }
        )
      ),
    };
  } else {
    return {
      status: 404,
      body: defaultStringify({
        message: DEFAULT_NOT_FOUND_MESSAGE,
      }),
    };
  }
};
