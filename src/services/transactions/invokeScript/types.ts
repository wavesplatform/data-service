import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
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
    InvokeScriptTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<InvokeScriptTx>
  >;
  mget: Service<
    InvokeScriptTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<InvokeScriptTx>[]
  >;
  search: Service<
    InvokeScriptTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<InvokeScriptTx>
  >;
};
