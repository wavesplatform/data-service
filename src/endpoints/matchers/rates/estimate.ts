import { Context } from 'koa';
import { compose } from 'ramda';
import * as maybe from 'folktale/maybe';

import { ServiceMget, Rate, RateMgetParams } from '../../../types';
import { select } from '../../utils/selectors';
import { captureErrors } from '../../../utils/captureErrors';
import { parseFilterValues } from '../../_common/filters';

import { handleError } from '../../../utils/handleError';
import { parseArrayQuery } from '../../utils/parseArrayQuery';
import { dateOrNull } from '../../../utils/parseDate';

import { parsePairs } from '../parsePairs';

const filterParsers = {
  pairs: compose(
    (val: maybe.Maybe<string[]>) => val.map(parsePairs).getOrElse(null),
    (val: string[] | undefined): maybe.Maybe<string[]> =>
      maybe.fromNullable(val),
    parseArrayQuery
  ),
  timestamp: dateOrNull,
};

/**
 * Endpoint
 * @name /matchers/:matcher/rates?pairs[]‌="{asset_id_1}/{asset_id_2}"&pairs[]="{asset_id_1}/{asset_id_2}" ...other params
 */
const rateEstimateEndpoint = (
  service: ServiceMget<RateMgetParams, Rate>
) => async (ctx: Context) => {
  const { fromParams, query } = select(ctx);
  const [matcher] = fromParams(['matcher']);
  const fValues = parseFilterValues(filterParsers)(query);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: '/matchers/:matcher/rates',
    query,
  });

  const results = await service
    .mget({
      pairs: fValues.pairs,
      matcher,
      timestamp: maybe.fromNullable(fValues.timestamp),
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

export default (service: ServiceMget<RateMgetParams, Rate>) =>
  captureErrors(handleError)(rateEstimateEndpoint(service));
