import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
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
    TransferTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<TransferTx>
  >;
  mget: Service<
    TransferTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<TransferTx>[]
  >;
  search: Service<
    TransferTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<TransferTx>
  >;
};
