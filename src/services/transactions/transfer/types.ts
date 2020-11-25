import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
import {
  TransferTxsGetRequest,
  TransferTxsMgetRequest,
  TransferTxsSearchRequest,
  TransferTx,
} from './repo/types';

type TransferTxsServiceGetRequest = ServiceGetRequest<TransferTxsGetRequest>;
type TransferTxsServiceMgetRequest = ServiceMgetRequest<TransferTxsMgetRequest>;
type TransferTxsServiceSearchRequest = TransferTxsSearchRequest;

export type TransferTxsService = {
  get: Service<
    TransferTxsServiceGetRequest & WithMoneyFormat,
    Maybe<TransferTx>
  >;
  mget: Service<
    TransferTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<TransferTx>[]
  >;
  search: Service<
    TransferTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<TransferTx>
  >;
};
