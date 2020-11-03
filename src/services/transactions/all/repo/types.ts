import { BigNumber } from '@waves/data-entities';
import { Repo, CommonTransactionInfo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters } from '../../_common/types';

export type TxDbResponse = {
  uid: BigNumber;
  tx_type: number;
  id: string;
  time_stamp: string;
};

export type AllTxsGetRequest = string;

export type AllTxsMgetRequest = string[];

export type AllTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
>;

export type AllTxsRepo = Repo<
  AllTxsGetRequest,
  AllTxsMgetRequest,
  AllTxsSearchRequest,
  CommonTransactionInfo
>;
