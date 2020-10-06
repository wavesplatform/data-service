import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
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
    SetAssetScriptTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<SetAssetScriptTx>
  >;
  mget: Service<
    SetAssetScriptTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<SetAssetScriptTx>[]
  >;
  search: Service<
    SetAssetScriptTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<SetAssetScriptTx>
  >;
};
