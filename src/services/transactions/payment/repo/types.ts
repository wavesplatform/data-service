import { Repo, TransactionInfo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx } from '../../_common/types';

export type PaymentTxDbResponse = RawTx & {
  amount: string;
  recipient: string;
};

export type PaymentTxsGetRequest = string;

export type PaymentTxsMgetRequest = string[];

export type PaymentTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    recipient: string;
  }>;

export type PaymentTxsRepo = Repo<
  PaymentTxsGetRequest,
  PaymentTxsMgetRequest,
  PaymentTxsSearchRequest,
  TransactionInfo
>;
