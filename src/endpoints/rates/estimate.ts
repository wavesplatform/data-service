import BigNumber from '@waves/bignumber'
import { select } from '../utils/selectors';
import { trimmedStringIfDefined } from 'endpoints/utils/parseString';
import { parseFilterValues } from 'endpoints/_common/filters';
import { captureErrors } from 'utils/captureErrors';
import { handleError } from 'utils/handleError';
import { Task, of, waitAll } from 'folktale/concurrency/task';
import { Transaction, ServiceSearch } from 'types';
import * as maybe from 'folktale/maybe';
import { Context } from 'koa'
import { ExchangeTxsSearchRequest } from 'services/transactions/exchange';
import { SortOrder } from 'services/_common';
import { AppError } from 'errorHandling';

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

      const results = estimator.getRate(amountAsset, priceAsset, fValues.matcher)

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
