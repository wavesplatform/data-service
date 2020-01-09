import { Repo, TransactionInfo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx } from '../../_common/types';

export type SetScriptTxDbResponse = RawTx & {
  script: string;
};

export type SetScriptTxsGetRequest = string;

export type SetScriptTxsMgetRequest = string[];

export type SetScriptTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    sender: string;
    script: string;
  }>;

export type SetScriptTxsRepo = Repo<
  SetScriptTxsGetRequest,
  SetScriptTxsMgetRequest,
  SetScriptTxsSearchRequest,
  TransactionInfo
>;
