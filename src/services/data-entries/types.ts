import {
  DataEntriesByTransactionRequest,
  DataEntriesByAddressRequest,
  DataEntriesSearchRequest,
} from '../../protobuf/data-entries';

export type DataEntriesRequest = {
  address?: string;
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

export type GrpcDataEntriesRequest =
  | DataEntriesByTransactionRequest
  | DataEntriesByAddressRequest
  | DataEntriesSearchRequest;
