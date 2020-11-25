import { Repo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx, Tx } from '../../_common/types';
import { BigNumber } from '@waves/data-entities';

export type TransferTxDbResponse = RawTx & {
  amount: BigNumber;
  asset_id: string;
  fee_asset: string;
  attachment: string;
  recipient: string;
};

export type TransferTx = Tx & {
  amount: BigNumber;
  assetId: string;
  recipient: string;
  attachment: string;
};

export type TransferTxsGetRequest = string;

export type TransferTxsMgetRequest = string[];

export type TransferTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    sender: string;
    assetId: string;
    recipient: string;
  }>;

export type TransferTxsRepo = Repo<
  TransferTxsGetRequest,
  TransferTxsMgetRequest,
  TransferTxsSearchRequest,
  TransferTx
>;
