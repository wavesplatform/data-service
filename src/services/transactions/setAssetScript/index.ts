import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
import {
  SetAssetScriptTxsRepo,
  SetAssetScriptTxsGetRequest,
  SetAssetScriptTxsMgetRequest,
  SetAssetScriptTxsSearchRequest,
} from './repo/types';
import { TransactionInfo } from '../../../types';

export type SetAssetScriptTxsServiceGetRequest = ServiceGetRequest<
  SetAssetScriptTxsGetRequest
>;
export type SetAssetScriptTxsServiceMgetRequest = ServiceMgetRequest<
  SetAssetScriptTxsMgetRequest
>;
export type SetAssetScriptTxsServiceSearchRequest = SetAssetScriptTxsSearchRequest;

export type SetAssetScriptTxsService = {
  get: Service<
    SetAssetScriptTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<TransactionInfo>
  >;
  mget: Service<
    SetAssetScriptTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<TransactionInfo>[]
  >;
  search: Service<
    SetAssetScriptTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<TransactionInfo>
  >;
};

export default (repo: SetAssetScriptTxsRepo): SetAssetScriptTxsService => ({
  get: req => repo.get(req.id),
  mget: req => repo.mget(req.ids),
  search: req => repo.search(req),
});
