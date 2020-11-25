import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithMoneyFormat } from '../../types';
import {
  UpdateAssetInfoTxsGetRequest,
  UpdateAssetInfoTxsMgetRequest,
  UpdateAssetInfoTxsSearchRequest,
  UpdateAssetInfoTx,
} from './repo/types';

type UpdateAssetInfoTxsServiceGetRequest = ServiceGetRequest<
  UpdateAssetInfoTxsGetRequest
>;
type UpdateAssetInfoTxsServiceMgetRequest = ServiceMgetRequest<
  UpdateAssetInfoTxsMgetRequest
>;
type UpdateAssetInfoTxsServiceSearchRequest = UpdateAssetInfoTxsSearchRequest;

export type UpdateAssetInfoTxsService = {
  get: Service<
    UpdateAssetInfoTxsServiceGetRequest & WithMoneyFormat,
    Maybe<UpdateAssetInfoTx>
  >;
  mget: Service<
    UpdateAssetInfoTxsServiceMgetRequest & WithMoneyFormat,
    Maybe<UpdateAssetInfoTx>[]
  >;
  search: Service<
    UpdateAssetInfoTxsServiceSearchRequest & WithMoneyFormat,
    SearchedItems<UpdateAssetInfoTx>
  >;
};
