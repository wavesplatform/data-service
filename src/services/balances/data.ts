import * as grpc from 'grpc';
import { Balance } from '../../protobuf/balances';

import { Task, task } from 'folktale/concurrency/task';
import { DbError, toDbError } from '../../errorHandling';

import { BalancesRequest, GrpcBalancesRequest } from './types';
import { getPathByReq, buildRequest, reqSerializer } from './utils';

export const getBalances = (client: grpc.Client) => (
  req: BalancesRequest
): Task<DbError, Balance[]> => {
  return task(resolver => {
    const path = getPathByReq(req);
    const request = buildRequest(req);

    const response: Balance[] = [];
    const stream = client.makeServerStreamRequest<GrpcBalancesRequest, Balance>(
      path,
      reqSerializer,
      Balance.decode,
      request
    );

    stream.on('data', data => response.push(data));

    stream.on('end', () => resolver.resolve(response));

    stream.on('error', (e: Error) => {
      resolver.reject(toDbError({}, e));
    });
  });
};
