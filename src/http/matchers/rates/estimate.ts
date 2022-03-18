import { tap } from '../../../utils/tap';
import { RatesMgetService } from '../../../services/rates';
import { createHttpHandler } from '../../_common';
import { parse } from './parse';
import { serialize } from './serialize';

export default (service: RatesMgetService) =>
  createHttpHandler(
    (req, lsnFormat) =>
      service(req)
        .map(
          tap((rates) => {
            rates.forEach((rate) =>
              console.log(
                `Rate for ${rate.amountAsset}/${
                  rate.priceAsset
                } = ${rate.rate.toString()}`
              )
            );
          })
        )
        .map((res) => serialize(res, lsnFormat)),
    parse
  );
