import { SearchedItems, CandleInfo, candle, Candle } from '../../types';
import { stringify } from '../../utils/json';
import { search as searchSerializer } from '../_common/serialize';
import { HttpResponse } from '../_common/types';
import { contentTypeWithLSN } from '../_common/utils';
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

export const serializeCandleInfo = (
  data: CandleInfo | null,
  lsnFormat: LSNFormat
): HttpResponse => {
  if (data) {
    return HttpResponse.Ok(
      stringify(lsnFormat)(candle(data))
    ).withHeaders({
      'Content-Type': contentTypeWithLSN(lsnFormat),
    });
  } else {
    return HttpResponse.NotFound();
  }
};
