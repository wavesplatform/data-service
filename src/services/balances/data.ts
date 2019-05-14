import * as grpc from 'grpc';
import * as Long from 'long';
import {
  Balance,
  BalancesByTransactionRequest,
  BalancesByAddressRequest,
  BalancesByAssetRequest,
} from '../../protobuf/balances';

import { Task, task } from 'folktale/concurrency/task';
import { DbError, toDbError } from '../../errorHandling';
import base58 from '../../utils/base58';

export type BalancesRequest = {
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

type GrpcBalancesRequest =
  | BalancesByTransactionRequest
  | BalancesByAddressRequest
  | BalancesByAssetRequest;

export const getBalances = (client: grpc.Client) => (
  req: BalancesRequest
): Task<DbError, Balance[]> => {
  return task(resolver => {
    const reqSerializer = (request: GrpcBalancesRequest): Buffer => {
      if (request instanceof BalancesByTransactionRequest) {
        return Buffer.from(
          BalancesByTransactionRequest.encode(request).finish()
        );
      } else if (request instanceof BalancesByAddressRequest) {
        return Buffer.from(BalancesByAddressRequest.encode(request).finish());
      } else {
        return Buffer.from(BalancesByAssetRequest.encode(request).finish());
      }
    };

    const getPathByReq = (req: BalancesRequest) => {
      if (req.transaction_id) {
        return '/Balances/ByTransaction';
      } else if (req.address) {
        return '/Balances/ByAddress';
      } else {
        return '/Balances/ByAsset';
      }
    };

    const buildRequest = (req: BalancesRequest): GrpcBalancesRequest => {
      let request;
      if (req.transaction_id) {
        request = new BalancesByTransactionRequest({
          transactionId: base58.decode(req.transaction_id),
        });
      } else {
        if (req.address) {
          request = new BalancesByAddressRequest({
            address: base58.decode(req.address),
          });
        } else {
          request = new BalancesByAssetRequest();
        }

        if (req.height) {
          request.height = req.height;
        }
        if (req.timestamp) {
          request.timestamp = Long.fromNumber(req.timestamp.getTime());
        }
        if (req.after) {
          request.after = base58.decode(req.after);
        }
        request.limit = req.limit;
      }
      return request;
    };

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
