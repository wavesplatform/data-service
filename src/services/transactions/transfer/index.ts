import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
import {
  TransferTxsRepo,
  TransferTxsGetRequest,
  TransferTxsMgetRequest,
  TransferTxsSearchRequest,
} from './repo/types';
import { TransactionInfo } from '../../../types';

export type TransferTxsServiceGetRequest = ServiceGetRequest<
  TransferTxsGetRequest
>;
export type TransferTxsServiceMgetRequest = ServiceMgetRequest<
  TransferTxsMgetRequest
>;
export type TransferTxsServiceSearchRequest = TransferTxsSearchRequest;

export type TransferTxsService = {
  get: Service<
    TransferTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<TransactionInfo>
  >;
  mget: Service<
    TransferTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<TransactionInfo>[]
  >;
  search: Service<
    TransferTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<TransactionInfo>
  >;
};

export default (repo: TransferTxsRepo): TransferTxsService => ({
  get: req => repo.get(req.id),
  mget: req => repo.mget(req.ids),
  search: req => repo.search(req),
});
