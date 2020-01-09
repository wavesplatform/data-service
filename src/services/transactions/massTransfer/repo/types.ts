import { Repo, TransactionInfo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx } from '../../_common/types';
import { BigNumber } from '@waves/data-entities';

export type MassTransferTxDbResponse = RawTx & {
  asset_id: string;
  attachment: string;
  sender: string;
  sender_public_key: string;
  recipients: string;
  amounts: BigNumber[];
};

export type MassTransferTxsGetRequest = string;

export type MassTransferTxsMgetRequest = string[];

export type MassTransferTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
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
  TransactionInfo
>;
