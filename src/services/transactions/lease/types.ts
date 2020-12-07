import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
import {
  LeaseTxsGetRequest,
  LeaseTxsMgetRequest,
  LeaseTxsSearchRequest,
  LeaseTx,
} from './repo/types';

type LeaseTxsServiceGetRequest = ServiceGetRequest<LeaseTxsGetRequest>;
type LeaseTxsServiceMgetRequest = ServiceMgetRequest<LeaseTxsMgetRequest>;
type LeaseTxsServiceSearchRequest = LeaseTxsSearchRequest & WithMoneyFormat;

export type LeaseTxsService = {
  get: Service<
    LeaseTxsServiceGetRequest & WithMoneyFormat & WithMoneyFormat,
    Maybe<LeaseTx>
  >;
  mget: Service<
    LeaseTxsServiceMgetRequest & WithMoneyFormat & WithMoneyFormat,
    Maybe<LeaseTx>[]
  >;
  search: Service<
    LeaseTxsServiceSearchRequest & WithMoneyFormat & WithMoneyFormat,
    SearchedItems<LeaseTx>
  >;
};
