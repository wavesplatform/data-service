import { Repo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx, Tx } from '../../_common/types';

export type EthereumLikeTransfer = 'transfer';
export type EthereumLikeInvocation = 'invocation';

export type EthereumLikeTxDbResponse = RawTx & {
  payload: string;
  function_name: string | null;
};

export type EthereumLikeTxPayload =
  | { type: EthereumLikeTransfer }
  | { type: EthereumLikeInvocation; call: { function: string } };

export type EthereumLikeTx = Tx & {
  bytes: string;
  payload: EthereumLikeTxPayload;
};

export type EthereumLikeTxsGetRequest = string;

export type EthereumLikeTxsMgetRequest = string[];

export type EthereumLikeTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    type: EthereumLikeTransfer | EthereumLikeInvocation;
    function: string;
  }>;

export type EthereumLikeTxsRepo = Repo<
  EthereumLikeTxsGetRequest,
  EthereumLikeTxsMgetRequest,
  EthereumLikeTxsSearchRequest,
  EthereumLikeTx
>;
