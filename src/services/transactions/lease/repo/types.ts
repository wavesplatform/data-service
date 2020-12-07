import { BigNumber } from '@waves/data-entities';
import { Repo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx, Tx } from '../../_common/types';

export type LeaseTxDbResponse = RawTx & {
  amount: BigNumber;
  recipient: string;
};

export type LeaseTx = Tx & {
  amount: BigNumber;
  recipient: string;
};

export type LeaseTxsGetRequest = string;

export type LeaseTxsMgetRequest = string[];

export type LeaseTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    recipient: string;
  }>;

export type LeaseTxsRepo = Repo<
  LeaseTxsGetRequest,
  LeaseTxsMgetRequest,
  LeaseTxsSearchRequest,
  LeaseTx
>;
