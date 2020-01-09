import { Repo, TransactionInfo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx } from '../../_common/types';

export type LeaseCancelTxDbResponse = RawTx & {
  lease_id: string;
};

export type LeaseCancelTxsGetRequest = string;

export type LeaseCancelTxsMgetRequest = string[];

export type LeaseCancelTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    recipient: string;
  }>;

export type LeaseCancelTxsRepo = Repo<
  LeaseCancelTxsGetRequest,
  LeaseCancelTxsMgetRequest,
  LeaseCancelTxsSearchRequest,
  TransactionInfo
>;
