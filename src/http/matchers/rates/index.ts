import * as Router from 'koa-router';
import { RatesMgetService } from '../../../services/rates';
import * as postToGet from '../../utils/postToGet';
import getEstimateRateHandler from './estimate';

const subrouter: Router = new Router();

export default (rateService: RatesMgetService): Router =>
  subrouter
    .get('/rates', getEstimateRateHandler(rateService))
    .post('/rates', postToGet(getEstimateRateHandler(rateService)));
