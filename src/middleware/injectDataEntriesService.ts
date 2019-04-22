import * as compose from 'koa-compose';
import * as grpc from 'grpc';

import { DataServiceConfig } from '../loadConfig';
import { DataEntriesClient } from '../protobuf/data-entries_grpc_pb';

const inject = require('./inject');

export default (options: DataServiceConfig) => {
  const client = new DataEntriesClient(
    options.dataEntriesServiceHost,
    grpc.credentials.createInsecure()
  );

  return compose([inject(['drivers', 'dataEntries'], client)]);
};
