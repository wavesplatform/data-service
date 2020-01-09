import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
import {
  LeaseTxsRepo,
  LeaseTxsGetRequest,
  LeaseTxsMgetRequest,
  LeaseTxsSearchRequest,
} from './repo/types';
import { TransactionInfo } from '../../../types';

export type LeaseTxsServiceGetRequest = ServiceGetRequest<LeaseTxsGetRequest>;
export type LeaseTxsServiceMgetRequest = ServiceMgetRequest<
  LeaseTxsMgetRequest
>;
export type LeaseTxsServiceSearchRequest = LeaseTxsSearchRequest;

export type LeaseTxsService = {
  get: Service<
    LeaseTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<TransactionInfo>
  >;
  mget: Service<
    LeaseTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<TransactionInfo>[]
  >;
  search: Service<
    LeaseTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<TransactionInfo>
  >;
};

export default (repo: LeaseTxsRepo): LeaseTxsService => ({
  get: req => repo.get(req.id),
  mget: req => repo.mget(req.ids),
  search: req => repo.search(req),
});
