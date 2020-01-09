import { list, rate, RateWithPairIds } from '../../../types';
import { DEFAULT_NOT_FOUND_MESSAGE } from '../../../errorHandling';
import { stringify } from '../../../utils/json';
import { defaultStringify } from '../../_common/utils';
import { HttpResponse } from '../../_common/types';
import { LSNFormat } from '../../types';

export const serialize = (
  data: RateWithPairIds[],
  lsnFormat: LSNFormat
): HttpResponse => {
  if (!data.length) {
    return {
      status: 404,
      body: defaultStringify({
        message: DEFAULT_NOT_FOUND_MESSAGE,
      }),
    };
  } else {
    return {
      status: 200,
      body: stringify(lsnFormat)(
        list(
          data.map(r =>
            rate(
              { rate: r.rate },
              { amountAsset: r.amountAsset, priceAsset: r.priceAsset }
            )
          )
        )
      ),
    };
  }
};
