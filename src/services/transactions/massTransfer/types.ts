import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
import {
  MassTransferTxsGetRequest,
  MassTransferTxsMgetRequest,
  MassTransferTxsSearchRequest,
  MassTransferTx,
} from './repo/types';

type MassTransferTxsServiceGetRequest = ServiceGetRequest<
  MassTransferTxsGetRequest
>;
type MassTransferTxsServiceMgetRequest = ServiceMgetRequest<
  MassTransferTxsMgetRequest
>;
type MassTransferTxsServiceSearchRequest = MassTransferTxsSearchRequest;

export type MassTransferTxsService = {
  get: Service<
    MassTransferTxsServiceGetRequest & WithMoneyFormat,
    Maybe<MassTransferTx>
  >;
  mget: Service<
    MassTransferTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<MassTransferTx>[]
  >;
  search: Service<
    MassTransferTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<MassTransferTx>
  >;
};
