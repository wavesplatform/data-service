import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
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
    ReissueTxsServiceGetRequest & WithMoneyFormat,
    Maybe<ReissueTx>
  >;
  mget: Service<
    ReissueTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<ReissueTx>[]
  >;
  search: Service<
    ReissueTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<ReissueTx>
  >;
};
