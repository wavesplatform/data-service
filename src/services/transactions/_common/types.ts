export type DbRawTx = {
  height: number;
  tx_type: number;
  id: string;
  time_stamp: Date;
  signature: string;
  proofs: string[];
  tx_version: number | null;
  sender: string;
  sender_public_key: string;
  fee: bigint;
};

export type RawTx = {
  height: number;
  tx_type: number;
  id: string;
  time_stamp: Date;
  signature: string;
  proofs: string[];
  tx_version: number | null;
  sender: string;
  sender_public_key: string;
  fee: bigint;
};

export type Tx = {
  height: number;
  type: number;
  id: string;
  timestamp: Date;
  signature: string;
  proofs: string[];
  version?: number;
  sender: string;
  senderPublicKey: string;
  fee: bigint;
};
