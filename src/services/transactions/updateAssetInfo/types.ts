import { Maybe } from 'folktale/maybe';
import {
  Service,
  SearchedItems,
  ServiceGetRequest,
  ServiceMgetRequest,
} from '../../../types';
import { WithDecimalsFormat } from '../../types';
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
    UpdateAssetInfoTxsServiceGetRequest & WithDecimalsFormat,
    Maybe<UpdateAssetInfoTx>
  >;
  mget: Service<
    UpdateAssetInfoTxsServiceMgetRequest & WithDecimalsFormat,
    Maybe<UpdateAssetInfoTx>[]
  >;
  search: Service<
    UpdateAssetInfoTxsServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<UpdateAssetInfoTx>
  >;
};
