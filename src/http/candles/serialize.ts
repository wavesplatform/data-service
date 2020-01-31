import { SearchedItems, CandleInfo, candle, Candle } from '../../types';
import { search as searchSerializer } from '../_common/serialize';
import { HttpResponse } from '../_common/types';
import { LSNFormat } from '../types';

export const serialize = (
  data: SearchedItems<CandleInfo>,
  lsnFormat: LSNFormat
): HttpResponse => {
  if (data.items.length) {
    return searchSerializer<CandleInfo | null, Candle>(candle, lsnFormat)(data);
  } else {
    return HttpResponse.NotFound();
  }
};
