import { Repo, TransactionInfo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx } from '../../_common/types';

export type ReissueTxDbResponse = RawTx & {
  asset_id: string;
  quantity: string;
  reissuable: string;
};

export type ReissueTxsGetRequest = string;

export type ReissueTxsMgetRequest = string[];

export type ReissueTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    assetId: string;
  }>;

export type ReissueTxsRepo = Repo<
  ReissueTxsGetRequest,
  ReissueTxsMgetRequest,
  ReissueTxsSearchRequest,
  TransactionInfo
>;
