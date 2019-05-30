import * as grpc from 'grpc';
import * as Long from 'long';
import {
  DataEntryResponse,
  DataEntriesByTransactionRequest,
  DataEntriesByAddressRequest,
  DataEntriesSearchRequest,
} from '../../protobuf/data-entries';
import { DataEntriesService } from '../../protobuf/data-entries_grpc_pb';

import { Task, task } from 'folktale/concurrency/task';
import { DbError, toDbError } from '../../errorHandling';
import base58 from '../../utils/base58';

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

type GrpcDataEntriesRequest =
  | DataEntriesByTransactionRequest
  | DataEntriesByAddressRequest
  | DataEntriesSearchRequest;

export const getDataEntries = (client: grpc.Client) => (
  req: DataEntriesRequest
): Task<DbError, DataEntryResponse[]> => {
  return task(resolver => {
    const reqSerializer = (request: GrpcDataEntriesRequest): Buffer => {
      if (request instanceof DataEntriesByTransactionRequest) {
        return Buffer.from(
          DataEntriesByTransactionRequest.encode(request).finish()
        );
      } else if (request instanceof DataEntriesByAddressRequest) {
        return Buffer.from(
          DataEntriesByAddressRequest.encode(request).finish()
        );
      } else {
        return Buffer.from(DataEntriesSearchRequest.encode(request).finish());
      }
    };

    const getPathByReq = (req: DataEntriesRequest) => {
      if (req.transaction_id) {
        return DataEntriesService.byTransaction.path;
      } else if (req.address) {
        return DataEntriesService.byAddress.path;
      } else {
        return DataEntriesService.search.path;
      }
    };

    const buildRequest = (req: DataEntriesRequest): GrpcDataEntriesRequest => {
      let request;
      if (req.transaction_id) {
        request = new DataEntriesByTransactionRequest({
          transactionId: base58.decode(req.transaction_id),
        });
      } else {
        if (req.address) {
          request = new DataEntriesByAddressRequest({
            address: base58.decode(req.address),
          });
        } else {
          request = new DataEntriesSearchRequest();
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
        if (req.after) {
          request.after = Buffer.from(req.after);
        }
        request.limit = req.limit;
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
