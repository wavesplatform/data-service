import * as Router from 'koa-router';

import candlesSearch from './search';
import { CandlesService } from '../../../services/candles';

const subrouter: Router = new Router();

export default (service: CandlesService): Router =>
  subrouter
    .get('/candles/:amountAsset/:priceAsset', candlesSearch(service))
    .get('/candles/:amountAsset', candlesSearch(service));
