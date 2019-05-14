import * as compose from 'koa-compose';
import * as grpc from 'grpc';

import { DataServiceConfig } from '../loadConfig';
import {
  DataEntryResponse,
  ByTransactionRequest,
  ByAddressRequest,
  SearchRequest,
} from '../protobuf/data-entries';

const inject = require('./inject');

const service = {
  byTransaction: {
    path: '/DataEntries/ByTransaction',
    requestStream: false,
    responseStream: true,
    requestSerialize: (req: ByTransactionRequest) =>
      Buffer.from(ByTransactionRequest.encode(req).finish()),
    requestDeserialize: ByTransactionRequest.decode,
    responseSerialize: (res: DataEntryResponse) =>
      Buffer.from(DataEntryResponse.encode(res).finish()),
    responseDeserialize: DataEntryResponse.decode,
  },
  byAddress: {
    path: '/DataEntries/ByAddress',
    requestStream: false,
    responseStream: true,
    requestSerialize: (req: ByAddressRequest) =>
      Buffer.from(ByAddressRequest.encode(req).finish()),
    requestDeserialize: ByAddressRequest.decode,
    responseSerialize: (res: DataEntryResponse) =>
      Buffer.from(DataEntryResponse.encode(res).finish()),
    responseDeserialize: DataEntryResponse.decode,
  },
  search: {
    path: '/DataEntries/Search',
    requestStream: false,
    responseStream: true,
    requestSerialize: (req: SearchRequest) =>
      Buffer.from(SearchRequest.encode(req).finish()),
    requestDeserialize: ByAddressRequest.decode,
    responseSerialize: (res: DataEntryResponse) =>
      Buffer.from(DataEntryResponse.encode(res).finish()),
    responseDeserialize: DataEntryResponse.decode,
  },
};
const client = grpc.makeGenericClientConstructor(service, 'DataEntries', {});

export default (
  options: DataServiceConfig
): compose.ComposedMiddleware<any> => {
  const cl = new client(
    `${options.dataEntriesService.host}:${options.dataEntriesService.port}`,
    grpc.credentials.createInsecure()
  );

  return compose([inject(['drivers', 'dataEntries'], cl)]);
};
