import * as Router from 'koa-router';

import { ServiceMget, Rate, RateMgetParams } from '../../../types';
import getEstimateRateHandler from './estimate';
import * as postToGet from '../../utils/postToGet';

const subrouter: Router = new Router();

export default (rateService: ServiceMget<RateMgetParams, Rate>): Router =>
  subrouter
    .get('/rates', getEstimateRateHandler(rateService))
    .post('/rates', postToGet(getEstimateRateHandler(rateService)));
