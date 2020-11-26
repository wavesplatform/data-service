import { Repo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx, Tx } from '../../_common/types';

export type AliasTxDbResponse = RawTx & {
  alias: string;
};

export type AliasTx = Tx & {
  alias: string;
};

export type AliasTxsGetRequest = string;

export type AliasTxsMgetRequest = string[];

export type AliasTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
>;

export type AliasTxsRepo = Repo<
  AliasTxsGetRequest,
  AliasTxsMgetRequest,
  AliasTxsSearchRequest,
  AliasTx
>;
