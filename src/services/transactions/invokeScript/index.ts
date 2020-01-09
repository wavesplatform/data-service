import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
import {
  InvokeScriptTxsRepo,
  InvokeScriptTxsGetRequest,
  InvokeScriptTxsMgetRequest,
  InvokeScriptTxsSearchRequest,
} from './repo/types';
import { TransactionInfo } from '../../../types';

export type InvokeScriptTxsServiceGetRequest = ServiceGetRequest<
  InvokeScriptTxsGetRequest
>;
export type InvokeScriptTxsServiceMgetRequest = ServiceMgetRequest<
  InvokeScriptTxsMgetRequest
>;
export type InvokeScriptTxsServiceSearchRequest = InvokeScriptTxsSearchRequest;

export type InvokeScriptTxsService = {
  get: Service<
    InvokeScriptTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<TransactionInfo>
  >;
  mget: Service<
    InvokeScriptTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<TransactionInfo>[]
  >;
  search: Service<
    InvokeScriptTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<TransactionInfo>
  >;
};

export default (repo: InvokeScriptTxsRepo): InvokeScriptTxsService => ({
  get: req => repo.get(req.id),
  mget: req => repo.mget(req.ids),
  search: req => repo.search(req),
});
