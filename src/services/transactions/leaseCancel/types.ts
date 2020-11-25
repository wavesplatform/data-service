import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
import {
  LeaseCancelTx,
  LeaseCancelTxsGetRequest,
  LeaseCancelTxsMgetRequest,
  LeaseCancelTxsSearchRequest,
} from './repo/types';

type LeaseCancelTxsServiceGetRequest = ServiceGetRequest<
  LeaseCancelTxsGetRequest
>;
type LeaseCancelTxsServiceMgetRequest = ServiceMgetRequest<
  LeaseCancelTxsMgetRequest
>;
type LeaseCancelTxsServiceSearchRequest = LeaseCancelTxsSearchRequest;

export type LeaseCancelTxsService = {
  get: Service<
    LeaseCancelTxsServiceGetRequest & WithMoneyFormat,
    Maybe<LeaseCancelTx>
  >;
  mget: Service<
    LeaseCancelTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<LeaseCancelTx>[]
  >;
  search: Service<
    LeaseCancelTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<LeaseCancelTx>
  >;
};
