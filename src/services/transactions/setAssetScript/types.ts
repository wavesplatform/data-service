import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
import {
  SetAssetScriptTxsGetRequest,
  SetAssetScriptTxsMgetRequest,
  SetAssetScriptTxsSearchRequest,
  SetAssetScriptTx,
} from './repo/types';

type SetAssetScriptTxsServiceGetRequest = ServiceGetRequest<
  SetAssetScriptTxsGetRequest
>;
type SetAssetScriptTxsServiceMgetRequest = ServiceMgetRequest<
  SetAssetScriptTxsMgetRequest
>;
type SetAssetScriptTxsServiceSearchRequest = SetAssetScriptTxsSearchRequest;

export type SetAssetScriptTxsService = {
  get: Service<
    SetAssetScriptTxsServiceGetRequest & WithMoneyFormat,
    Maybe<SetAssetScriptTx>
  >;
  mget: Service<
    SetAssetScriptTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<SetAssetScriptTx>[]
  >;
  search: Service<
    SetAssetScriptTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<SetAssetScriptTx>
  >;
};
