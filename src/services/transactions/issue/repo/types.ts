import { Repo, TransactionInfo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx } from '../../_common/types';

export type IssueTxDbResponse = RawTx & {
  asset_id: string;
  amount: string;
};

export type IssueTxsGetRequest = string;

export type IssueTxsMgetRequest = string[];

export type IssueTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    assetId: string;
    script: string;
  }>;

export type IssueTxsRepo = Repo<
  IssueTxsGetRequest,
  IssueTxsMgetRequest,
  IssueTxsSearchRequest,
  TransactionInfo
>;
