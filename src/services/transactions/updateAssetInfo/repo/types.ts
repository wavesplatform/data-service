import { Repo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx, Tx } from '../../_common/types';

export type UpdateAssetInfoTxDbResponse = RawTx & {
  asset_id: string;
  asset_name: string;
  description: string;
};

export type UpdateAssetInfoTx = Tx & {
  assetId: string;
  name: string;
  description: string;
};

export type UpdateAssetInfoTxsGetRequest = string;

export type UpdateAssetInfoTxsMgetRequest = string[];

export type UpdateAssetInfoTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    assetId: string;
  }>;

export type UpdateAssetInfoTxsRepo = Repo<
  UpdateAssetInfoTxsGetRequest,
  UpdateAssetInfoTxsMgetRequest,
  UpdateAssetInfoTxsSearchRequest,
  UpdateAssetInfoTx
>;
