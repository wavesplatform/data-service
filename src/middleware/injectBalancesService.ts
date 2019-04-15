import * as compose from 'koa-compose';
import * as grpc from 'grpc';

import { DataServiceConfig } from '../loadConfig';
import { BalancesClient } from '../protobuf/balances_grpc_pb';

const inject = require('./inject');

export default (options: DataServiceConfig) => {
  const client = new BalancesClient(
    options.balancesServiceHost,
    grpc.credentials.createInsecure()
  );

  return compose([inject(['drivers', 'balances'], client)]);
};
