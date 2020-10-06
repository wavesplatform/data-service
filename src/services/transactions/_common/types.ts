import { BigNumber } from '@waves/data-entities';

type CommonTxFields = {
  height: number;
  id: string;
  signature: string;
  proofs: string[];
  sender: string;
  fee: BigNumber;
};

export type WithTxUid = {
  tx_uid: BigNumber;
};

export type RawTx = CommonTxFields &
  WithTxUid & {
    tx_type: number;
    time_stamp: Date;
    tx_version: number | null;
    sender_public_key: string;
  };

export type Tx = CommonTxFields & {
  type: number;
  timestamp: Date;
  version?: number;
  senderPublicKey: string;
  fee: BigNumber;
  feeAsset?: string;
  feeAssetId?: string;
};

export type CommonFilters = {
  timeStart?: Date;
  timeEnd?: Date;
  sender?: string;
};
