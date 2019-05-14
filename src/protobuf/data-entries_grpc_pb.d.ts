// package: 
// file: data-entries.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as data_entries_pb from "./data-entries_pb";
import * as transaction_pb from "./transaction_pb";

interface IDataEntriesService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    byTransaction: IDataEntriesService_IByTransaction;
    byAddress: IDataEntriesService_IByAddress;
    search: IDataEntriesService_ISearch;
}

interface IDataEntriesService_IByTransaction extends grpc.MethodDefinition<data_entries_pb.DataEntriesByTransactionRequest, data_entries_pb.DataEntryResponse> {
    path: string; // "/.DataEntries/ByTransaction"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<data_entries_pb.DataEntriesByTransactionRequest>;
    requestDeserialize: grpc.deserialize<data_entries_pb.DataEntriesByTransactionRequest>;
    responseSerialize: grpc.serialize<data_entries_pb.DataEntryResponse>;
    responseDeserialize: grpc.deserialize<data_entries_pb.DataEntryResponse>;
}
interface IDataEntriesService_IByAddress extends grpc.MethodDefinition<data_entries_pb.DataEntriesByAddressRequest, data_entries_pb.DataEntryResponse> {
    path: string; // "/.DataEntries/ByAddress"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<data_entries_pb.DataEntriesByAddressRequest>;
    requestDeserialize: grpc.deserialize<data_entries_pb.DataEntriesByAddressRequest>;
    responseSerialize: grpc.serialize<data_entries_pb.DataEntryResponse>;
    responseDeserialize: grpc.deserialize<data_entries_pb.DataEntryResponse>;
}
interface IDataEntriesService_ISearch extends grpc.MethodDefinition<data_entries_pb.DataEntriesSearchRequest, data_entries_pb.DataEntryResponse> {
    path: string; // "/.DataEntries/Search"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<data_entries_pb.DataEntriesSearchRequest>;
    requestDeserialize: grpc.deserialize<data_entries_pb.DataEntriesSearchRequest>;
    responseSerialize: grpc.serialize<data_entries_pb.DataEntryResponse>;
    responseDeserialize: grpc.deserialize<data_entries_pb.DataEntryResponse>;
}

export const DataEntriesService: IDataEntriesService;

export interface IDataEntriesServer {
    byTransaction: grpc.handleServerStreamingCall<data_entries_pb.DataEntriesByTransactionRequest, data_entries_pb.DataEntryResponse>;
    byAddress: grpc.handleServerStreamingCall<data_entries_pb.DataEntriesByAddressRequest, data_entries_pb.DataEntryResponse>;
    search: grpc.handleServerStreamingCall<data_entries_pb.DataEntriesSearchRequest, data_entries_pb.DataEntryResponse>;
}

export interface IDataEntriesClient {
    byTransaction(request: data_entries_pb.DataEntriesByTransactionRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntryResponse>;
    byTransaction(request: data_entries_pb.DataEntriesByTransactionRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntryResponse>;
    byAddress(request: data_entries_pb.DataEntriesByAddressRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntryResponse>;
    byAddress(request: data_entries_pb.DataEntriesByAddressRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntryResponse>;
    search(request: data_entries_pb.DataEntriesSearchRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntryResponse>;
    search(request: data_entries_pb.DataEntriesSearchRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntryResponse>;
}

export class DataEntriesClient extends grpc.Client implements IDataEntriesClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public byTransaction(request: data_entries_pb.DataEntriesByTransactionRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntryResponse>;
    public byTransaction(request: data_entries_pb.DataEntriesByTransactionRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntryResponse>;
    public byAddress(request: data_entries_pb.DataEntriesByAddressRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntryResponse>;
    public byAddress(request: data_entries_pb.DataEntriesByAddressRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntryResponse>;
    public search(request: data_entries_pb.DataEntriesSearchRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntryResponse>;
    public search(request: data_entries_pb.DataEntriesSearchRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntryResponse>;
}
