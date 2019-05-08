// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var data$entries_pb = require('./data-entries_pb.js');
var transaction_pb = require('./transaction_pb.js');

function serialize_ByAddressRequest(arg) {
  if (!(arg instanceof data$entries_pb.ByAddressRequest)) {
    throw new Error('Expected argument of type ByAddressRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ByAddressRequest(buffer_arg) {
  return data$entries_pb.ByAddressRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ByTransactionRequest(arg) {
  if (!(arg instanceof data$entries_pb.ByTransactionRequest)) {
    throw new Error('Expected argument of type ByTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ByTransactionRequest(buffer_arg) {
  return data$entries_pb.ByTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_SearchRequest(arg) {
  if (!(arg instanceof data$entries_pb.SearchRequest)) {
    throw new Error('Expected argument of type SearchRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_SearchRequest(buffer_arg) {
  return data$entries_pb.SearchRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var DataEntriesService = exports.DataEntriesService = {
  byTransaction: {
    path: '/DataEntries/ByTransaction',
    requestStream: false,
    responseStream: true,
    requestType: data$entries_pb.ByTransactionRequest,
    responseType: data$entries_pb.DataEntryResponse,
    requestSerialize: serialize_ByTransactionRequest,
    requestDeserialize: deserialize_ByTransactionRequest,
    responseSerialize: serialize_DataEntryResponse,
    responseDeserialize: deserialize_DataEntryResponse,
  },
  byAddress: {
    path: '/DataEntries/ByAddress',
    requestStream: false,
    responseStream: true,
    requestType: data$entries_pb.ByAddressRequest,
    responseType: data$entries_pb.DataEntryResponse,
    requestSerialize: serialize_ByAddressRequest,
    requestDeserialize: deserialize_ByAddressRequest,
    responseSerialize: serialize_DataEntryResponse,
    responseDeserialize: deserialize_DataEntryResponse,
  },
  search: {
    path: '/DataEntries/Search',
    requestStream: false,
    responseStream: true,
    requestType: data$entries_pb.SearchRequest,
    responseType: data$entries_pb.DataEntryResponse,
    requestSerialize: serialize_SearchRequest,
    requestDeserialize: deserialize_SearchRequest,
    responseSerialize: serialize_DataEntryResponse,
    responseDeserialize: deserialize_DataEntryResponse,
  },
};

exports.DataEntriesClient = grpc.makeGenericClientConstructor(DataEntriesService);
