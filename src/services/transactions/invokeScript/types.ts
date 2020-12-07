import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
import {
  InvokeScriptTx,
  InvokeScriptTxsGetRequest,
  InvokeScriptTxsMgetRequest,
  InvokeScriptTxsSearchRequest,
} from './repo/types';

type InvokeScriptTxsServiceGetRequest = ServiceGetRequest<
  InvokeScriptTxsGetRequest
>;
type InvokeScriptTxsServiceMgetRequest = ServiceMgetRequest<
  InvokeScriptTxsMgetRequest
>;
type InvokeScriptTxsServiceSearchRequest = InvokeScriptTxsSearchRequest;

export type InvokeScriptTxsService = {
  get: Service<
    InvokeScriptTxsServiceGetRequest & WithMoneyFormat,
    Maybe<InvokeScriptTx>
  >;
  mget: Service<
    InvokeScriptTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<InvokeScriptTx>[]
  >;
  search: Service<
    InvokeScriptTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<InvokeScriptTx>
  >;
};
