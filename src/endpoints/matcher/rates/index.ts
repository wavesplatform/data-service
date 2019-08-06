import * as Router from 'koa-router';

import { ServiceMget, Rate, RateMgetParams } from '../../../types';
import getEstimateRateHandler from './estimate';

const subrouter: Router = new Router();

export default (rateService: ServiceMget<RateMgetParams, Rate>): Router =>
  subrouter.get("/rates", getEstimateRateHandler(rateService))
