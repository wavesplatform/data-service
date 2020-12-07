import * as Router from 'koa-router';
import { PairsService } from '../../services/pairs'
import { CandlesService } from '../../services/candles';
import { RatesMgetService } from '../../services/rates';

import createPairs from './pairs';
import createCandles from './candles';
import createRates from './rates';

const subrouter = new Router({ prefix: '/matchers/:matcher' });

export default ({
  pairs,
  candles,
  rates,
}: {
  pairs: PairsService;
  candles: CandlesService;
  rates: RatesMgetService;
}) =>
  subrouter
    .use(createPairs(pairs).routes())
    .use(createCandles(candles).routes())
    .use(createRates(rates).routes());
