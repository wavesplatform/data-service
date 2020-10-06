import { BigNumber } from '@waves/data-entities';
import { Repo, DataEntryType } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx, Tx } from '../../_common/types';

type DataEntry = {
  key: string;
  type: DataEntryType;
  value: DataEntryValue;
};

export type DataEntryValue = boolean | BigNumber | string;

export type DataTxDbResponse = RawTx & {
  data: DataEntry[];
};

export type DataTx = Tx & {
  data: DataEntry[];
};

export type DataTxsGetRequest = string;

export type DataTxsMgetRequest = string[];

export type DataTxsSearchRequest<CursorType = string> = RequestWithCursor<
  CommonFilters &
    WithSortOrder &
    WithLimit &
    Partial<{
      key: string;
      type: DataEntryType;
      value: DataEntryValue;
    }>,
  CursorType
>;

export type DataTxsRepo = Repo<
  DataTxsGetRequest,
  DataTxsMgetRequest,
  DataTxsSearchRequest,
  DataTx
>;
