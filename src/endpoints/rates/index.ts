import * as Router from 'koa-router';
import { rateEstimateEndpointFactory, PairCheckService, RateEstimator, TransactionService } from './estimate'
import * as task from 'folktale/concurrency/task';
import * as maybe from 'folktale/maybe';

const dummyPairCheck: PairCheckService = {
  checkPair() { return task.of(maybe.empty()) }
}

export default function(
  transactionService: TransactionService,
  pairChecker: PairCheckService = dummyPairCheck
): Router {
  
  const router = new Router();

  const handler = rateEstimateEndpointFactory(
    '/rates/:amountAsset/:priceAsset',
    new RateEstimator(transactionService, pairChecker)
  );

  router.get('/rates/:amountAsset/:priceAsset', handler);
  
  return router;
}
