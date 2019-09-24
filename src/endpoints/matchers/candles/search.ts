const { identity } = require('ramda');

import { captureErrors } from '../../../utils/captureErrors';
import { handleError } from '../../../utils/handleError';
import { select } from '../../utils/selectors';
import { parseFilterValues, timeStart, timeEnd } from '../../_common/filters';
import { CandlesService } from '../../../services/candles';
import { Context } from 'koa';

const url = '/matchers/{matcher}/candles/:amountAsset/:priceAsset';

const candlesSearch = (service: CandlesService) => async (ctx: Context) => {
  const { fromParams } = select(ctx);
  const [matcher, amountAsset, priceAsset] = fromParams([
    'matcher',
    'amountAsset',
    'priceAsset',
  ]);

  const { query } = select(ctx);

  // @todo unsafe — timeEnd can be null.
  // to fix that, need to do service params passing and validation differently
  const fValues = parseFilterValues({
    timeStart,
    timeEnd,
    interval: identity,
  })(query) as {
    timeStart: Date;
    timeEnd: Date;
    interval: string;
  };

  if (!fValues.timeEnd) {
    fValues.timeEnd = new Date();
  }

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: `${url}`,
    query,
  });

  let results = await service
    .search({
      amountAsset,
      priceAsset,
      matcher,
      ...fValues,
    })
    .run()
    .promise();

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: results,
  });

  if (results) {
    ctx.state.returnValue = results;
  } else {
    ctx.status = 404;
  }
};

export default (service: CandlesService) =>
  captureErrors(handleError)(candlesSearch(service));
