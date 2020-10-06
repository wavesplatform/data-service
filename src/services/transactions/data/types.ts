import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
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
  get: Service<DataTxsServiceGetRequest & WithDecimalsFormat, Maybe<DataTx>>;
  mget: Service<
    DataTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<DataTx>[]
  >;
  search: Service<
    DataTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<DataTx>
  >;
};
