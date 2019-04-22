// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var data$entries_pb = require('./data-entries_pb.js');

function serialize_DataEntry(arg) {
  if (!(arg instanceof data$entries_pb.DataEntry)) {
    throw new Error('Expected argument of type DataEntry');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DataEntry(buffer_arg) {
  return data$entries_pb.DataEntry.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetDataEntriesRequest(arg) {
  if (!(arg instanceof data$entries_pb.GetDataEntriesRequest)) {
    throw new Error('Expected argument of type GetDataEntriesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetDataEntriesRequest(buffer_arg) {
  return data$entries_pb.GetDataEntriesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var DataEntriesService = exports.DataEntriesService = {
  getDataEntries: {
    path: '/DataEntries/GetDataEntries',
    requestStream: false,
    responseStream: true,
    requestType: data$entries_pb.GetDataEntriesRequest,
    responseType: data$entries_pb.DataEntry,
    requestSerialize: serialize_GetDataEntriesRequest,
    requestDeserialize: deserialize_GetDataEntriesRequest,
    responseSerialize: serialize_DataEntry,
    responseDeserialize: deserialize_DataEntry,
  },
};

exports.DataEntriesClient = grpc.makeGenericClientConstructor(DataEntriesService);
