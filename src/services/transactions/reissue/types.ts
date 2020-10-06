import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
import {
  ReissueTxsGetRequest,
  ReissueTxsMgetRequest,
  ReissueTxsSearchRequest,
  ReissueTx,
} from './repo/types';

type ReissueTxsServiceGetRequest = ServiceGetRequest<ReissueTxsGetRequest>;
type ReissueTxsServiceMgetRequest = ServiceMgetRequest<ReissueTxsMgetRequest>;
type ReissueTxsServiceSearchRequest = ReissueTxsSearchRequest;

export type ReissueTxsService = {
  get: Service<
    ReissueTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<ReissueTx>
  >;
  mget: Service<
    ReissueTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<ReissueTx>[]
  >;
  search: Service<
    ReissueTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<ReissueTx>
  >;
};
