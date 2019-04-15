import * as grpc from 'grpc';
import { BalancesClient } from '../../protobuf/balances_grpc_pb';
import { GetBalancesRequest, Balance } from '../../protobuf/balances_pb';

import { task } from 'folktale/concurrency/task';

export const getBalances = ({ db }: { db: BalancesClient }) => ({
  address,
  assetId,
  height,
  timestamp,
  transactionId,
}: {
  address?: string | Uint8Array;
  assetId?: string | Uint8Array;
  height?: number;
  timestamp?: Date;
  transactionId: string;
}) => {
  return task(resolver => {
    const request = new GetBalancesRequest();
    if (address) {
      request.setAddress(address);
    }
    if (assetId) {
      request.setAssetId(assetId);
    }
    if (height) {
      request.setHeight(height);
    }
    if (timestamp) {
      request.setTimestamp(timestamp.getTime());
    }
    if (transactionId) {
      request.setTransactionId(Buffer.from('test').toString('base64'));
    }
    console.log(`[getBalances] Request: ${JSON.stringify(request.toObject())}`);

    const stream: grpc.ClientReadableStream<Balance> = db.getBalances(request);

    const response: Balance.AsObject[] = [];

    stream.on('data', (data: Balance) => {
      console.log(`[getBalances] Balance: ${JSON.stringify(data.toObject())}`);
      response.push(data.toObject());
    });
    stream.on('end', () => {
      console.log('[getBalances] Done.');
      resolver.resolve(response);
    });
  });
};
