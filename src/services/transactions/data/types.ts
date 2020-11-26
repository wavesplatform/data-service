import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
import {
  DataTx,
  DataTxsGetRequest,
  DataTxsMgetRequest,
  DataTxsSearchRequest,
} from './repo/types';

type DataTxsServiceGetRequest = ServiceGetRequest<DataTxsGetRequest>;
export type DataTxsServiceMgetRequest = ServiceMgetRequest<DataTxsMgetRequest>;
export type DataTxsServiceSearchRequest = DataTxsSearchRequest;

export type DataTxsService = {
  get: Service<DataTxsServiceGetRequest & WithMoneyFormat, Maybe<DataTx>>;
  mget: Service<
    DataTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<DataTx>[]
  >;
  search: Service<
    DataTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<DataTx>
  >;
};
