import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
import {
  SetScriptTxsGetRequest,
  SetScriptTxsMgetRequest,
  SetScriptTxsSearchRequest,
  SetScriptTx,
} from './repo/types';

type SetScriptTxsServiceGetRequest = ServiceGetRequest<SetScriptTxsGetRequest>;
type SetScriptTxsServiceMgetRequest = ServiceMgetRequest<
  SetScriptTxsMgetRequest
>;
type SetScriptTxsServiceSearchRequest = SetScriptTxsSearchRequest;

export type SetScriptTxsService = {
  get: Service<
    SetScriptTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<SetScriptTx>
  >;
  mget: Service<
    SetScriptTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<SetScriptTx>[]
  >;
  search: Service<
    SetScriptTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<SetScriptTx>
  >;
};
