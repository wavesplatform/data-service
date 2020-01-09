import { Repo, TransactionInfo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx } from '../../_common/types';

export type SetAssetScriptTxDbResponse = RawTx & {
  asset_id: string;
  script: string;
};

export type SetAssetScriptTxsGetRequest = string;

export type SetAssetScriptTxsMgetRequest = string[];

export type SetAssetScriptTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    assetId: string;
    script: string;
  }>;

export type SetAssetScriptTxsRepo = Repo<
  SetAssetScriptTxsGetRequest,
  SetAssetScriptTxsMgetRequest,
  SetAssetScriptTxsSearchRequest,
  TransactionInfo
>;
