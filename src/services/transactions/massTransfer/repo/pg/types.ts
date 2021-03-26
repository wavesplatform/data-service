import { BigNumber } from '@waves/data-entities';

import { RawTx } from '../../../_common/types';

export type DbRawMassTransferTxTransfer = {
  recipient_alias: string | null;
  recipient_address: string;
  amount: BigNumber;
  position_in_tx: number;
};

export type DbRawMassTransferTx = RawTx & {
  asset_id: string;
  attachment: string;
} & DbRawMassTransferTxTransfer;
