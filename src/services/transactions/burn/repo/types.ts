import { Repo, TransactionInfo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx } from '../../_common/types';

export type BurnTxDbResponse = RawTx & {
  asset_id: string;
  amount: string;
};

export type BurnTxsGetRequest = string;

export type BurnTxsMgetRequest = string[];

export type BurnTxsSearchRequest = RequestWithCursor<
  CommonFilters &
    WithSortOrder &
    WithLimit &
    Partial<{
      assetId: string;
    }>,
  string
>;

export type BurnTxsRepo = Repo<
  BurnTxsGetRequest,
  BurnTxsMgetRequest,
  BurnTxsSearchRequest,
  TransactionInfo
>;
