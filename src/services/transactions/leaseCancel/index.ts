import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
import {
  LeaseCancelTxsRepo,
  LeaseCancelTxsGetRequest,
  LeaseCancelTxsMgetRequest,
  LeaseCancelTxsSearchRequest,
} from './repo/types';
import { TransactionInfo } from '../../../types';

export type LeaseCancelTxsServiceGetRequest = ServiceGetRequest<
  LeaseCancelTxsGetRequest
>;
export type LeaseCancelTxsServiceMgetRequest = ServiceMgetRequest<
  LeaseCancelTxsMgetRequest
>;
export type LeaseCancelTxsServiceSearchRequest = LeaseCancelTxsSearchRequest;

export type LeaseCancelTxsService = {
  get: Service<
    LeaseCancelTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<TransactionInfo>
  >;
  mget: Service<
    LeaseCancelTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<TransactionInfo>[]
  >;
  search: Service<
    LeaseCancelTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<TransactionInfo>
  >;
};

export default (repo: LeaseCancelTxsRepo): LeaseCancelTxsService => ({
  get: req => repo.get(req.id),
  mget: req => repo.mget(req.ids),
  search: req => repo.search(req),
});
