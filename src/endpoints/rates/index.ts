import * as Router from 'koa-router';

import { ServiceGet, RateGetParams, Rate } from '../../types';
import getEstimateRateHandler from './estimate';

const subrouter: Router = new Router();

export default (rateService: ServiceGet<RateGetParams, Rate>): Router =>
  subrouter.get("/rates/:id1/:id2", getEstimateRateHandler(rateService))
