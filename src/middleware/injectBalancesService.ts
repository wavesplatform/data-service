import * as compose from 'koa-compose';
import * as grpc from 'grpc';

import { DataServiceConfig } from '../loadConfig';
import {
  Balance,
  BalancesByTransactionRequest,
  BalancesByAddressRequest,
  BalancesByAssetRequest,
} from '../protobuf/balances';

const inject = require('./inject');

const balanceToBuffer = (res: Balance) =>
  Buffer.from(Balance.encode(res).finish());

const service = {
  byTransaction: {
    path: '/Balances/ByTransaction',
    requestStream: false,
    responseStream: true,
    requestSerialize: (req: BalancesByTransactionRequest) =>
      Buffer.from(BalancesByTransactionRequest.encode(req).finish()),
    requestDeserialize: BalancesByTransactionRequest.decode,
    responseSerialize: balanceToBuffer,
    responseDeserialize: Balance.decode,
  },
  byAddress: {
    path: '/Balances/ByAddress',
    requestStream: false,
    responseStream: true,
    requestSerialize: (req: BalancesByAddressRequest) =>
      Buffer.from(BalancesByAddressRequest.encode(req).finish()),
    requestDeserialize: BalancesByAddressRequest.decode,
    responseSerialize: balanceToBuffer,
    responseDeserialize: Balance.decode,
  },
  search: {
    path: '/Balances/ByAsset',
    requestStream: false,
    responseStream: true,
    requestSerialize: (req: BalancesByAssetRequest) =>
      Buffer.from(BalancesByAssetRequest.encode(req).finish()),
    requestDeserialize: BalancesByAssetRequest.decode,
    responseSerialize: balanceToBuffer,
    responseDeserialize: Balance.decode,
  },
};
const client = grpc.makeGenericClientConstructor(service, 'Balances', {});

export default (
  options: DataServiceConfig
): compose.ComposedMiddleware<any> => {
  const cl = new client(
    `${options.balancesService.host}:${options.balancesService.port}`,
    grpc.credentials.createInsecure()
  );

  return compose([inject(['drivers', 'balances'], cl)]);
};
