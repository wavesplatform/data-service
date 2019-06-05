import * as grpc from 'grpc';
import { DataEntryResponse } from '../../protobuf/data-entries';

import { Task, task } from 'folktale/concurrency/task';
import { DbError, toDbError } from '../../errorHandling';

import { DataEntriesRequest, GrpcDataEntriesRequest } from './types';
import { getPathByReq, buildRequest, reqSerializer } from './utils';

export const getDataEntries = (client: grpc.Client) => (
  req: DataEntriesRequest
): Task<DbError, DataEntryResponse[]> => {
  return task(resolver => {
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
