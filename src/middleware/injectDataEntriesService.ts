import * as compose from 'koa-compose';
import * as grpc from 'grpc';

import { DataServiceConfig } from '../loadConfig';
import {
  DataEntryResponse,
  ByTransactionRequest,
  ByAddressRequest,
  SearchRequest,
} from '../protobuf/data-entries';

const service = {
  byTransaction: {
    path: '/DataEntries/ByTransaction',
    requestStream: false,
    responseStream: true,
    requestSerialize: (req: ByTransactionRequest) =>
      Buffer.from(req.toString(), 'base64'),
    requestDeserialize: ByTransactionRequest.decode,
    responseSerialize: (res: any) => Buffer.from(res.toString(), 'base64'),
    responseDeserialize: DataEntryResponse.decode,
  },
  byAddress: {
    path: '/DataEntries/ByAddress',
    requestStream: false,
    responseStream: true,
    requestSerialize: (req: ByAddressRequest) =>
      Buffer.from(req.toString(), 'base64'),
    requestDeserialize: ByAddressRequest.decode,
    responseSerialize: (res: any) => Buffer.from(res.toString(), 'base64'),
    responseDeserialize: DataEntryResponse.decode,
  },
  search: {
    path: '/DataEntries/Search',
    requestStream: false,
    responseStream: true,
    requestSerialize: (req: SearchRequest) =>
      Buffer.from(req.toString(), 'base64'),
    requestDeserialize: ByAddressRequest.decode,
    responseSerialize: (res: any) => Buffer.from(res.toString(), 'base64'),
    responseDeserialize: DataEntryResponse.decode,
  },
};
const client = grpc.makeGenericClientConstructor(service, 'DataEntries', {});

const inject = require('./inject');

export default (options: DataServiceConfig) => {
  const cl = new client(
    options.dataEntriesServiceHost,
    grpc.credentials.createInsecure()
  );

  return compose([inject(['drivers', 'dataEntries'], cl)]);
};
