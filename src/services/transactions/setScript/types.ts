import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
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
    SetScriptTxsServiceGetRequest & WithMoneyFormat,
    Maybe<SetScriptTx>
  >;
  mget: Service<
    SetScriptTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<SetScriptTx>[]
  >;
  search: Service<
    SetScriptTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<SetScriptTx>
  >;
};
