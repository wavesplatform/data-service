import { select } from '../utils/selectors';
import { trimmedStringIfDefined } from 'endpoints/utils/parseString';
import { parseFilterValues } from 'endpoints/_common/filters';
import { captureErrors } from 'utils/captureErrors';
import { handleError } from 'utils/handleError';
import { Context } from 'koa'
import { RateEstimator } from 'services/rates';

export const rateEstimateEndpointFactory = (uri: string,  estimator: RateEstimator) =>
  {
    const handler = async (ctx: Context) => {
      const { fromParams } = select(ctx);
      const [amountAsset, priceAsset] = fromParams(['amountAsset', 'priceAsset']);

      const { query } = select(ctx);

      const fValues = parseFilterValues({
        // TODO:
        matcher: trimmedStringIfDefined,
      })(query);

      if (!fValues.matcher) {
        fValues.matcher = ctx.state.config.defaultMatcher;
      }

      ctx.eventBus.emit('ENDPOINT_HIT', {
        url: ctx.originalUrl,
        resolver: uri,
        query,
      });

      const results = estimator.get(
        {
          amountAsset,
          priceAsset,
          matcher: fValues.matcher
        }
      )

      ctx.eventBus.emit('ENDPOINT_RESOLVED', {
        value: results,
      });

      if (results) {
        ctx.state.returnValue = results;
      } else {
        ctx.status = 404;
      }
    }

    return captureErrors(handleError)(handler);
};
