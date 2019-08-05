import { Context } from 'koa';
import { map, compose, split } from 'ramda';
import * as maybe from 'folktale/maybe';

import { ServiceMget, Rate, RateMGetParams } from '../../../types';
import { select } from '../../utils/selectors';
import { captureErrors } from '../../../utils/captureErrors';
import {
  parseFilterValues,
} from '../../_common/filters';

import { handleError } from '../../../utils/handleError';
import { parseArrayQuery } from '../../utils/parseArrayQuery';
import { dateOrNull } from '../../../utils/parseDate';
import { DEFAULT_NOT_FOUND_MESSAGE } from '../../../errorHandling';

const parsePairs = map(
  compose(
    ([amountAsset, priceAsset]) => ({ amountAsset, priceAsset }),
    split('/')
  )
);

const filterParsers = {
  pairs: compose(
    (val: maybe.Maybe<string[]>) => val.map(parsePairs).getOrElse(null),
    (val: string[] | undefined): maybe.Maybe<string[]> => maybe.fromNullable(val),
    parseArrayQuery
  ),
  date: dateOrNull,
};

/**
 * Endpoint
 * @name /rates?pairs[]‌="{asset_id_1}/{asset_id_2}"&pairs[]="{asset_id_1}/{asset_id_2}" ...other params
 */
const rateEstimateEndpoint = (service: ServiceMget<RateMGetParams, Rate>) => async (ctx: Context) => {
  const { fromParams, query } = select(ctx);
  const [matcher] = fromParams(['matcher']);
  const fValues = parseFilterValues(filterParsers)(query);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: '/pairs',
    query,
  });

  const results = await service
    .mget({ pairs: fValues.pairs, matcher, date: maybe.fromNullable(fValues.date) })
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
