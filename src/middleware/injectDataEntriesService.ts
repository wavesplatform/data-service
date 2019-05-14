import * as compose from 'koa-compose';
import * as grpc from 'grpc';

import { DataServiceConfig } from '../loadConfig';
import {
  DataEntryResponse,
  DataEntriesByTransactionRequest,
  DataEntriesByAddressRequest,
  DataEntriesSearchRequest,
} from '../protobuf/data-entries';

const inject = require('./inject');

const dataEntryResponseToBuffer = (res: DataEntryResponse) =>
  Buffer.from(DataEntryResponse.encode(res).finish());

const service = {
  byTransaction: {
    path: '/DataEntries/ByTransaction',
    requestStream: false,
    responseStream: true,
    requestSerialize: (req: DataEntriesByTransactionRequest) =>
      Buffer.from(DataEntriesByTransactionRequest.encode(req).finish()),
    requestDeserialize: DataEntriesByTransactionRequest.decode,
    responseSerialize: dataEntryResponseToBuffer,
    responseDeserialize: DataEntryResponse.decode,
  },
  byAddress: {
    path: '/DataEntries/ByAddress',
    requestStream: false,
    responseStream: true,
    requestSerialize: (req: DataEntriesByAddressRequest) =>
      Buffer.from(DataEntriesByAddressRequest.encode(req).finish()),
    requestDeserialize: DataEntriesByAddressRequest.decode,
    responseSerialize: dataEntryResponseToBuffer,
    responseDeserialize: DataEntryResponse.decode,
  },
  search: {
    path: '/DataEntries/Search',
    requestStream: false,
    responseStream: true,
    requestSerialize: (req: DataEntriesSearchRequest) =>
      Buffer.from(DataEntriesSearchRequest.encode(req).finish()),
    requestDeserialize: DataEntriesSearchRequest.decode,
    responseSerialize: dataEntryResponseToBuffer,
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
