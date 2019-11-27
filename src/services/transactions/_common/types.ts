type CommonTxFields = {
  height: number;
  id: string;
  signature: string;
  proofs: string[];
  sender: string;
  fee: bigint;
};

export type RawTxWithUid = {
  tx_uid: number;
};

export type RawTx = CommonTxFields &
  RawTxWithUid & {
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
};

export type CommonFilters = {
  timeStart?: Date;
  timeEnd?: Date;
  sender?: string;
};
