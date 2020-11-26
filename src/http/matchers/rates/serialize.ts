import { list, rate, RateWithPairIds } from '../../../types';
import { stringify } from '../../../utils/json';
import { HttpResponse } from '../../_common/types';
import { LSNFormat } from '../../types';

export const serialize = (
  data: RateWithPairIds[],
  lsnFormat: LSNFormat
): HttpResponse => {
  if (!data.length) {
    return HttpResponse.NotFound();
  } else {
    return HttpResponse.Ok(
      stringify(lsnFormat)(
        list(
          data.map(r =>
            rate(
              { rate: r.rate },
              { amountAsset: r.amountAsset, priceAsset: r.priceAsset }
            )
          )
        )
      )
    );
  }
};
