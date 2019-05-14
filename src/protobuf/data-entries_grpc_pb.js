// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var data$entries_pb = require('./data-entries_pb.js');
var transaction_pb = require('./transaction_pb.js');

function serialize_DataEntriesByAddressRequest(arg) {
  if (!(arg instanceof data$entries_pb.DataEntriesByAddressRequest)) {
    throw new Error('Expected argument of type DataEntriesByAddressRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DataEntriesByAddressRequest(buffer_arg) {
  return data$entries_pb.DataEntriesByAddressRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DataEntriesByTransactionRequest(arg) {
  if (!(arg instanceof data$entries_pb.DataEntriesByTransactionRequest)) {
    throw new Error('Expected argument of type DataEntriesByTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DataEntriesByTransactionRequest(buffer_arg) {
  return data$entries_pb.DataEntriesByTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DataEntriesSearchRequest(arg) {
  if (!(arg instanceof data$entries_pb.DataEntriesSearchRequest)) {
    throw new Error('Expected argument of type DataEntriesSearchRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DataEntriesSearchRequest(buffer_arg) {
  return data$entries_pb.DataEntriesSearchRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DataEntryResponse(arg) {
  if (!(arg instanceof data$entries_pb.DataEntryResponse)) {
    throw new Error('Expected argument of type DataEntryResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DataEntryResponse(buffer_arg) {
  return data$entries_pb.DataEntryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var DataEntriesService = exports.DataEntriesService = {
  byTransaction: {
    path: '/DataEntries/ByTransaction',
    requestStream: false,
    responseStream: true,
    requestType: data$entries_pb.DataEntriesByTransactionRequest,
    responseType: data$entries_pb.DataEntryResponse,
    requestSerialize: serialize_DataEntriesByTransactionRequest,
    requestDeserialize: deserialize_DataEntriesByTransactionRequest,
    responseSerialize: serialize_DataEntryResponse,
    responseDeserialize: deserialize_DataEntryResponse,
  },
  byAddress: {
    path: '/DataEntries/ByAddress',
    requestStream: false,
    responseStream: true,
    requestType: data$entries_pb.DataEntriesByAddressRequest,
    responseType: data$entries_pb.DataEntryResponse,
    requestSerialize: serialize_DataEntriesByAddressRequest,
    requestDeserialize: deserialize_DataEntriesByAddressRequest,
    responseSerialize: serialize_DataEntryResponse,
    responseDeserialize: deserialize_DataEntryResponse,
  },
  search: {
    path: '/DataEntries/Search',
    requestStream: false,
    responseStream: true,
    requestType: data$entries_pb.DataEntriesSearchRequest,
    responseType: data$entries_pb.DataEntryResponse,
    requestSerialize: serialize_DataEntriesSearchRequest,
    requestDeserialize: deserialize_DataEntriesSearchRequest,
    responseSerialize: serialize_DataEntryResponse,
    responseDeserialize: deserialize_DataEntryResponse,
  },
};

exports.DataEntriesClient = grpc.makeGenericClientConstructor(DataEntriesService);
