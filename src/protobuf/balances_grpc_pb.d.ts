// package: 
// file: balances.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as balances_pb from "./balances_pb";
import * as transaction_pb from "./transaction_pb";

interface IBalancesService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    byTransaction: IBalancesService_IByTransaction;
    byAddress: IBalancesService_IByAddress;
    byAsset: IBalancesService_IByAsset;
    byTest: IBalancesService_IByTest;
}

interface IBalancesService_IByTransaction extends grpc.MethodDefinition<balances_pb.BalancesByTransactionRequest, balances_pb.Balance> {
    path: string; // "/.Balances/ByTransaction"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<balances_pb.BalancesByTransactionRequest>;
    requestDeserialize: grpc.deserialize<balances_pb.BalancesByTransactionRequest>;
    responseSerialize: grpc.serialize<balances_pb.Balance>;
    responseDeserialize: grpc.deserialize<balances_pb.Balance>;
}
interface IBalancesService_IByAddress extends grpc.MethodDefinition<balances_pb.BalancesByAddressRequest, balances_pb.Balance> {
    path: string; // "/.Balances/ByAddress"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<balances_pb.BalancesByAddressRequest>;
    requestDeserialize: grpc.deserialize<balances_pb.BalancesByAddressRequest>;
    responseSerialize: grpc.serialize<balances_pb.Balance>;
    responseDeserialize: grpc.deserialize<balances_pb.Balance>;
}
interface IBalancesService_IByAsset extends grpc.MethodDefinition<balances_pb.BalancesByAssetRequest, balances_pb.Balance> {
    path: string; // "/.Balances/ByAsset"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<balances_pb.BalancesByAssetRequest>;
    requestDeserialize: grpc.deserialize<balances_pb.BalancesByAssetRequest>;
    responseSerialize: grpc.serialize<balances_pb.Balance>;
    responseDeserialize: grpc.deserialize<balances_pb.Balance>;
}
interface IBalancesService_IByTest extends grpc.MethodDefinition<balances_pb.BalancesByAssetRequest, balances_pb.Balance> {
    path: string; // "/.Balances/ByTest"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<balances_pb.BalancesByAssetRequest>;
    requestDeserialize: grpc.deserialize<balances_pb.BalancesByAssetRequest>;
    responseSerialize: grpc.serialize<balances_pb.Balance>;
    responseDeserialize: grpc.deserialize<balances_pb.Balance>;
}

export const BalancesService: IBalancesService;

export interface IBalancesServer {
    byTransaction: grpc.handleServerStreamingCall<balances_pb.BalancesByTransactionRequest, balances_pb.Balance>;
    byAddress: grpc.handleServerStreamingCall<balances_pb.BalancesByAddressRequest, balances_pb.Balance>;
    byAsset: grpc.handleServerStreamingCall<balances_pb.BalancesByAssetRequest, balances_pb.Balance>;
    byTest: grpc.handleServerStreamingCall<balances_pb.BalancesByAssetRequest, balances_pb.Balance>;
}

export interface IBalancesClient {
    byTransaction(request: balances_pb.BalancesByTransactionRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    byTransaction(request: balances_pb.BalancesByTransactionRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    byAddress(request: balances_pb.BalancesByAddressRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    byAddress(request: balances_pb.BalancesByAddressRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    byAsset(request: balances_pb.BalancesByAssetRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    byAsset(request: balances_pb.BalancesByAssetRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    byTest(request: balances_pb.BalancesByAssetRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    byTest(request: balances_pb.BalancesByAssetRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
}

export class BalancesClient extends grpc.Client implements IBalancesClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public byTransaction(request: balances_pb.BalancesByTransactionRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    public byTransaction(request: balances_pb.BalancesByTransactionRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    public byAddress(request: balances_pb.BalancesByAddressRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    public byAddress(request: balances_pb.BalancesByAddressRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    public byAsset(request: balances_pb.BalancesByAssetRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    public byAsset(request: balances_pb.BalancesByAssetRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    public byTest(request: balances_pb.BalancesByAssetRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    public byTest(request: balances_pb.BalancesByAssetRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
}
