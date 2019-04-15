import * as grpc from 'grpc';
import { BalancesClient } from '../../protobuf/balances_grpc_pb';
import { GetBalancesRequest, Balance } from '../../protobuf/balances_pb';

import { Task, task } from 'folktale/concurrency/task';
import { DbError, toDbError } from '../../errorHandling';

type BalancesRequest = {
  address?: string;
  asset_id?: string;
  height?: number;
  timestamp?: Date;
  transaction_id: string;
};

export const getBalances = (db: BalancesClient) => (
  req: BalancesRequest
): Task<DbError, Balance.AsObject[]> => {
  return task(resolver => {
    const request = new GetBalancesRequest();

    if (req.address) {
      request.setAddress(Buffer.from(req.address).toString('base64'));
    }
    if (req.asset_id) {
      request.setAssetId(Buffer.from(req.asset_id).toString('base64'));
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

    const stream: grpc.ClientReadableStream<Balance> = db.getBalances(request);

    const response: Balance.AsObject[] = [];

    stream.on('data', (data: Balance) => {
      response.push(data.toObject());
    });

    stream.on('end', () => {
      resolver.resolve(response);
    });

    stream.on('error', e => {
      resolver.reject(toDbError({}, e))
    });
  });
};
