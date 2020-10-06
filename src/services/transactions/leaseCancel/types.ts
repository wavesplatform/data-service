import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
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
    LeaseCancelTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<LeaseCancelTx>
  >;
  mget: Service<
    LeaseCancelTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<LeaseCancelTx>[]
  >;
  search: Service<
    LeaseCancelTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<LeaseCancelTx>
  >;
};
