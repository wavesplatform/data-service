import { Repo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx, Tx } from '../../_common/types';
import { BigNumber } from '@waves/data-entities';

export type RawMassTransferTxTransfer = {
  recipient: string;
  amount: BigNumber;
  positionInTx: number;
};

export type RawMassTransferTx = RawTx & {
  asset_id: string;
  attachment: string;
} & RawMassTransferTxTransfer;

export type Transfer = {
  amount: BigNumber;
  recipient: string;
};

export type MassTransferTx = Tx & {
  assetId: string;
  attachment: string;
  transfers: Transfer[];
};

export type MassTransferTxsGetRequest = string;

export type MassTransferTxsMgetRequest = string[];

export type MassTransferTxsSearchRequest<CursorType = string> = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  CursorType
> &
  Partial<{
    sender: string;
    assetId: string;
    recipient: string;
  }>;

export type MassTransferTxsRepo = Repo<
  MassTransferTxsGetRequest,
  MassTransferTxsMgetRequest,
  MassTransferTxsSearchRequest,
  MassTransferTx
>;
