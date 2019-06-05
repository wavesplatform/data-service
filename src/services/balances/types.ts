import {
  BalancesByTransactionRequest,
  BalancesByAddressRequest,
  BalancesByAssetRequest,
} from '../../protobuf/balances';

export type BalancesRequest = {
  address?: string;
  asset?: string;
  height?: number;
  timestamp?: Date;
  transaction_id?: string;
  key?: string;
  type?: number;
  binary_value?: string | Uint8Array;
  bool_value?: boolean;
  int_value?: number;
  string_value?: string;
  limit: number;
  after?: string;
};

export type GrpcBalancesRequest =
  | BalancesByTransactionRequest
  | BalancesByAddressRequest
  | BalancesByAssetRequest;
