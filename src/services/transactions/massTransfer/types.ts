import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
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
    MassTransferTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<MassTransferTx>
  >;
  mget: Service<
    MassTransferTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<MassTransferTx>[]
  >;
  search: Service<
    MassTransferTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<MassTransferTx>
  >;
};
