// package: 
// file: balances.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as balances_pb from "./balances_pb";
import * as transaction_pb from "./transaction_pb";

interface IBalancesService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getBalances: IBalancesService_IGetBalances;
}

interface IBalancesService_IGetBalances extends grpc.MethodDefinition<balances_pb.GetBalancesRequest, balances_pb.Balance> {
    path: string; // "/.Balances/GetBalances"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<balances_pb.GetBalancesRequest>;
    requestDeserialize: grpc.deserialize<balances_pb.GetBalancesRequest>;
    responseSerialize: grpc.serialize<balances_pb.Balance>;
    responseDeserialize: grpc.deserialize<balances_pb.Balance>;
}

export const BalancesService: IBalancesService;

export interface IBalancesServer {
    getBalances: grpc.handleServerStreamingCall<balances_pb.GetBalancesRequest, balances_pb.Balance>;
}

export interface IBalancesClient {
    getBalances(request: balances_pb.GetBalancesRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    getBalances(request: balances_pb.GetBalancesRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
}

export class BalancesClient extends grpc.Client implements IBalancesClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getBalances(request: balances_pb.GetBalancesRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
    public getBalances(request: balances_pb.GetBalancesRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<balances_pb.Balance>;
}
