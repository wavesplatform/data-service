import * as grpc from 'grpc';
import { DataEntriesClient } from '../../protobuf/data-entries_grpc_pb';
import {
  GetDataEntriesRequest,
  DataEntry,
} from '../../protobuf/data-entries_pb';

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

export const getDataEntries = (db: DataEntriesClient) => (
  req: DataEntriesRequest
): Task<DbError, DataEntry.AsObject[]> => {
  return task(resolver => {
    const request = new GetDataEntriesRequest();
    if (req.address) {
      request.setAddress(base58.decode(req.address));
    }
    if (req.height) {
      request.setHeight(req.height);
    }
    if (req.timestamp) {
      request.setTimestamp(req.timestamp.getTime());
    }
    if (req.transaction_id) {
      request.setTransactionId(
        Buffer.from(req.transaction_id).toString('base64')
      );
    }
    const entry = new DataEntry();
    if (req.key) {
      entry.setKey(req.key);
    }
    if (req.type) {
      entry.setType(req.type);
    }
    if (req.binary_value) {
      entry.setBinaryValue(req.binary_value);
    }
    if (req.bool_value) {
      entry.setBoolValue(req.bool_value);
    }
    if (req.int_value) {
      entry.setIntValue(req.int_value);
    }
    if (req.string_value) {
      entry.setStringValue(req.string_value);
    }
    request.setEntry(entry);

    const stream: grpc.ClientReadableStream<DataEntry> = db.getDataEntries(
      request
    );

    const response: DataEntry.AsObject[] = [];

    stream.on('data', (data: DataEntry) => {
      response.push(data.toObject());
    });

    stream.on('end', () => {
      resolver.resolve(response);
    });

    stream.on('error', e => {
      resolver.reject(toDbError({}, e));
    });
  });
};
