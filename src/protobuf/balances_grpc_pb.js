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

function serialize_BalancesByAddressRequest(arg) {
  if (!(arg instanceof balances_pb.BalancesByAddressRequest)) {
    throw new Error('Expected argument of type BalancesByAddressRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_BalancesByAddressRequest(buffer_arg) {
  return balances_pb.BalancesByAddressRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_BalancesByAssetRequest(arg) {
  if (!(arg instanceof balances_pb.BalancesByAssetRequest)) {
    throw new Error('Expected argument of type BalancesByAssetRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_BalancesByAssetRequest(buffer_arg) {
  return balances_pb.BalancesByAssetRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_BalancesByTransactionRequest(arg) {
  if (!(arg instanceof balances_pb.BalancesByTransactionRequest)) {
    throw new Error('Expected argument of type BalancesByTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_BalancesByTransactionRequest(buffer_arg) {
  return balances_pb.BalancesByTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var BalancesService = exports.BalancesService = {
  byTransaction: {
    path: '/Balances/ByTransaction',
    requestStream: false,
    responseStream: true,
    requestType: balances_pb.BalancesByTransactionRequest,
    responseType: balances_pb.Balance,
    requestSerialize: serialize_BalancesByTransactionRequest,
    requestDeserialize: deserialize_BalancesByTransactionRequest,
    responseSerialize: serialize_Balance,
    responseDeserialize: deserialize_Balance,
  },
  byAddress: {
    path: '/Balances/ByAddress',
    requestStream: false,
    responseStream: true,
    requestType: balances_pb.BalancesByAddressRequest,
    responseType: balances_pb.Balance,
    requestSerialize: serialize_BalancesByAddressRequest,
    requestDeserialize: deserialize_BalancesByAddressRequest,
    responseSerialize: serialize_Balance,
    responseDeserialize: deserialize_Balance,
  },
  byAsset: {
    path: '/Balances/ByAsset',
    requestStream: false,
    responseStream: true,
    requestType: balances_pb.BalancesByAssetRequest,
    responseType: balances_pb.Balance,
    requestSerialize: serialize_BalancesByAssetRequest,
    requestDeserialize: deserialize_BalancesByAssetRequest,
    responseSerialize: serialize_Balance,
    responseDeserialize: deserialize_Balance,
  },
  byTest: {
    path: '/Balances/ByTest',
    requestStream: false,
    responseStream: true,
    requestType: balances_pb.BalancesByAssetRequest,
    responseType: balances_pb.Balance,
    requestSerialize: serialize_BalancesByAssetRequest,
    requestDeserialize: deserialize_BalancesByAssetRequest,
    responseSerialize: serialize_Balance,
    responseDeserialize: deserialize_Balance,
  },
};

exports.BalancesClient = grpc.makeGenericClientConstructor(BalancesService);
