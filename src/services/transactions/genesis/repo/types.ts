import { Repo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx, Tx } from '../../_common/types';
import { BigNumber } from '@waves/data-entities';

export type GenesisTxDbResponse = Omit<RawTx, 'sender'> & {
  amount: BigNumber;
  recipient: string;
};

export type GenesisTx = Omit<Tx, 'sender'> & {
  amount: BigNumber;
  recipient: string;
};

export type GenesisTxsGetRequest = string;

export type GenesisTxsMgetRequest = string[];

export type GenesisTxsSearchRequest = RequestWithCursor<
  Omit<CommonFilters, 'sender'> & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    recipient: string;
  }>;

export type GenesisTxsRepo = Repo<
  GenesisTxsGetRequest,
  GenesisTxsMgetRequest,
  GenesisTxsSearchRequest,
  GenesisTx
>;
