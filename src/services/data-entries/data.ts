import * as grpc from 'grpc';
import * as Long from 'long';
import {
  DataEntryResponse,
  ByTransactionRequest,
  ByAddressRequest,
  SearchRequest,
} from '../../protobuf/data-entries';

import { Task, task } from 'folktale/concurrency/task';
import { DbError, toDbError } from '../../errorHandling';
import base58 from '../../utils/base58';

type DataEntriesRequest = {
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
};

type GrpcDataEntriesRequest =
  | ByTransactionRequest
  | ByAddressRequest
  | SearchRequest;

export const getDataEntries = (client: grpc.Client) => (
  req: DataEntriesRequest
): Task<DbError, DataEntryResponse[]> => {
  return task(resolver => {
    const reqSerializer = (request: GrpcDataEntriesRequest): Buffer => {
      if (request instanceof ByTransactionRequest) {
        return Buffer.from(ByTransactionRequest.encode(request).finish());
      } else if (request instanceof ByAddressRequest) {
        return Buffer.from(ByAddressRequest.encode(request).finish());
      } else {
        return Buffer.from(SearchRequest.encode(request).finish());
      }
    };

    const getPathByReq = (req: DataEntriesRequest) => {
      if (req.transaction_id) {
        return '/DataEntries/ByTransaction';
      } else if (req.address) {
        return '/DataEntries/ByAddress';
      } else {
        return '/DataEntries/Search';
      }
    };

    const buildRequest = (req: DataEntriesRequest): GrpcDataEntriesRequest => {
      let request;
      if (req.transaction_id) {
        request = new ByTransactionRequest({
          transactionId: base58.decode(req.transaction_id),
        });
      } else {
        if (req.address) {
          request = new ByAddressRequest({
            address: base58.decode(req.address),
          });
        } else {
          request = new SearchRequest();
        }

        if (req.height) {
          request.height = req.height;
        }
        if (req.timestamp) {
          request.timestamp = Long.fromNumber(req.timestamp.getTime());
        }
        if (req.key) {
          request.key = req.key;
        }
        if (req.type) {
          request.type = req.type;
        }
        if (req.binary_value) {
          request.binaryValue = Buffer.from(
            req.binary_value.toString(),
            'base64'
          );
        }
        if (req.bool_value) {
          request.boolValue = req.bool_value;
        }
        if (req.int_value) {
          request.intValue = Long.fromNumber(req.int_value);
        }
        if (req.string_value) {
          request.stringValue = req.string_value;
        }
      }
      return request;
    };

    const path = getPathByReq(req);
    const request = buildRequest(req);

    const response: DataEntryResponse[] = [];
    const stream = client.makeServerStreamRequest<
      GrpcDataEntriesRequest,
      DataEntryResponse
    >(path, reqSerializer, DataEntryResponse.decode, request);

    stream.on('data', data => response.push(data));

    stream.on('end', () => resolver.resolve(response));

    stream.on('error', (e: Error) => {
      resolver.reject(toDbError({}, e));
    });
  });
};
