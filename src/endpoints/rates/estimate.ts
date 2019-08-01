import { Context } from 'koa';
import { map, compose, split, defaultTo } from 'ramda';
import * as maybe from 'folktale/maybe';

import { ServiceMget, Rate, RateMGetParams } from '../../types';
import { select } from '../utils/selectors';
import { captureErrors } from '../../utils/captureErrors';
import {
  parseFilterValues,
  query as queryFilter
} from '../_common/filters';

// import { query as parseQuery } from '../_common/filters/parsers';
import { handleError } from '../../utils/handleError';
import { parseArrayQuery } from '../utils/parseArrayQuery';
import { loadConfig } from '../../loadConfig';
import { DEFAULT_NOT_FOUND_MESSAGE } from '../../errorHandling';

const options = loadConfig();

const parsePairs = map(
  compose(
    ([amountAsset, priceAsset]) => ({ amountAsset, priceAsset }),
    split('/')
  )
);

const filterParsers = {
  pairs: compose(
    m => m.getOrElse(null),
    map(parsePairs),
    maybe.fromNullable,
    parseArrayQuery
  ),
  matcher: compose(
    queryFilter,
    defaultTo(options.matcher.default)
  ),
};

/**
 * Endpoint
 * @name /rates?pairs[]‌="{asset_id_1}/{asset_id_2}"&pairs[]="{asset_id_1}/{asset_id_2}" ...other params
 */
const rateEstimateEndpoint = (service: ServiceMget<RateMGetParams, Rate>) => async (ctx: Context) => {
  const { query } = select(ctx);
  const fValues = parseFilterValues(filterParsers)(query);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: '/pairs',
    query,
  });

  const results = await service
    .mget({ pairs: fValues.pairs, matcher: fValues.matcher })
    .run()
    .promise();

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: results,
  });

  if (results) {
    ctx.state.returnValue = results;
  } else {
    ctx.status = 404;
    ctx.body = {
      message: DEFAULT_NOT_FOUND_MESSAGE,
    };
  }
};

export default (service: ServiceMget<RateMGetParams, Rate>) =>
  captureErrors(handleError)(rateEstimateEndpoint(service));
