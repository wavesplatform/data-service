import * as Router from 'koa-router';

import { ServiceMget, Rate, RateMGetParams } from '../../types';
import getEstimateRateHandler from './estimate';

const subrouter: Router = new Router();

export default (rateService: ServiceMget<RateMGetParams, Rate>): Router =>
  subrouter.get("/rates", getEstimateRateHandler(rateService))
