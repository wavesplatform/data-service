import { Context } from 'koa';

import { ServiceGet, RateGetParams, Rate } from '../../types';
import { select } from '../utils/selectors';
import { captureErrors } from '../../utils/captureErrors';
import { parseFilterValues } from '../_common/filters';
import { query as parseQuery } from '../_common/filters/parsers';
import { handleError } from '../../utils/handleError';

/**
 * Endpoint
 * @name /rates/id1/id2...params
 */
const rateEstimateEndpoint = (service: ServiceGet<RateGetParams, Rate>) => async (ctx: Context) => {
  const { fromParams } = select(ctx);
  const [id1, id2] = fromParams(['id1', 'id2']);
  const { matcher } = parseFilterValues({ matcher: parseQuery })(ctx.query);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: '/rates/:id1/:id2',
  });

  const rate = await service
    .get({
      amountAsset: id1,
      priceAsset: id2,
      matcher: matcher || ctx.state.config.defaultMatcher,
    })
    .run()
    .promise();

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: rate,
  });

  rate.matchWith({
    Just: ({ value }) => (ctx.state.returnValue = value),
    Nothing: () => {
      ctx.status = 404;
    },
  });
};

export default (service: ServiceGet<RateGetParams, Rate>) =>
  captureErrors(handleError)(rateEstimateEndpoint(service));
