import * as Router from 'koa-router';
import { rateEstimateEndpointFactory } from './estimate'
import { ServiceSearch, Transaction } from 'types';
import { ExchangeTxsSearchRequest } from 'services/transactions/exchange';
import { PairCheckService, RateEstimator } from 'services/rates';

type TxSearch = ServiceSearch<ExchangeTxsSearchRequest, Transaction>

export default function(
  transactionService: TxSearch,
  pairChecker: PairCheckService
): Router {
  
  const router = new Router();

  const handler = rateEstimateEndpointFactory(
    '/rates/:amountAsset/:priceAsset',
    new RateEstimator(transactionService, pairChecker)
  );

  router.get('/rates/:amountAsset/:priceAsset', handler);
  
  return router;
}
