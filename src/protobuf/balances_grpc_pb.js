// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var balances_pb = require('./balances_pb.js');
var transaction_pb = require('./transaction_pb.js');

function serialize_Balance(arg) {
  if (!(arg instanceof balances_pb.Balance)) {
    throw new Error('Expected argument of type Balance');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Balance(buffer_arg) {
  return balances_pb.Balance.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetBalancesRequest(arg) {
  if (!(arg instanceof balances_pb.GetBalancesRequest)) {
    throw new Error('Expected argument of type GetBalancesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetBalancesRequest(buffer_arg) {
  return balances_pb.GetBalancesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var BalancesService = exports.BalancesService = {
  getBalances: {
    path: '/Balances/GetBalances',
    requestStream: false,
    responseStream: true,
    requestType: balances_pb.GetBalancesRequest,
    responseType: balances_pb.Balance,
    requestSerialize: serialize_GetBalancesRequest,
    requestDeserialize: deserialize_GetBalancesRequest,
    responseSerialize: serialize_Balance,
    responseDeserialize: deserialize_Balance,
  },
};

exports.BalancesClient = grpc.makeGenericClientConstructor(BalancesService);
