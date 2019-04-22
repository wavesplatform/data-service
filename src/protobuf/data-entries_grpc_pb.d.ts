// package: 
// file: data-entries.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as data_entries_pb from "./data-entries_pb";

interface IDataEntriesService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getDataEntries: IDataEntriesService_IGetDataEntries;
}

interface IDataEntriesService_IGetDataEntries extends grpc.MethodDefinition<data_entries_pb.GetDataEntriesRequest, data_entries_pb.DataEntry> {
    path: string; // "/.DataEntries/GetDataEntries"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<data_entries_pb.GetDataEntriesRequest>;
    requestDeserialize: grpc.deserialize<data_entries_pb.GetDataEntriesRequest>;
    responseSerialize: grpc.serialize<data_entries_pb.DataEntry>;
    responseDeserialize: grpc.deserialize<data_entries_pb.DataEntry>;
}

export const DataEntriesService: IDataEntriesService;

export interface IDataEntriesServer {
    getDataEntries: grpc.handleServerStreamingCall<data_entries_pb.GetDataEntriesRequest, data_entries_pb.DataEntry>;
}

export interface IDataEntriesClient {
    getDataEntries(request: data_entries_pb.GetDataEntriesRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntry>;
    getDataEntries(request: data_entries_pb.GetDataEntriesRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntry>;
}

export class DataEntriesClient extends grpc.Client implements IDataEntriesClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getDataEntries(request: data_entries_pb.GetDataEntriesRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntry>;
    public getDataEntries(request: data_entries_pb.GetDataEntriesRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<data_entries_pb.DataEntry>;
}
