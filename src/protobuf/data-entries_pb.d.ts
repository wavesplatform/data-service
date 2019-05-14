// package: 
// file: data-entries.proto

/* tslint:disable */

import * as jspb from "google-protobuf";
import * as transaction_pb from "./transaction_pb";

export class DataEntriesByTransactionRequest extends jspb.Message { 
    getTransactionId(): Uint8Array | string;
    getTransactionId_asU8(): Uint8Array;
    getTransactionId_asB64(): string;
    setTransactionId(value: Uint8Array | string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DataEntriesByTransactionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DataEntriesByTransactionRequest): DataEntriesByTransactionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DataEntriesByTransactionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DataEntriesByTransactionRequest;
    static deserializeBinaryFromReader(message: DataEntriesByTransactionRequest, reader: jspb.BinaryReader): DataEntriesByTransactionRequest;
}

export namespace DataEntriesByTransactionRequest {
    export type AsObject = {
        transactionId: Uint8Array | string,
    }
}

export class DataEntriesByAddressRequest extends jspb.Message { 
    getHeight(): number;
    setHeight(value: number): void;

    getTimestamp(): number;
    setTimestamp(value: number): void;

    getAddress(): Uint8Array | string;
    getAddress_asU8(): Uint8Array;
    getAddress_asB64(): string;
    setAddress(value: Uint8Array | string): void;

    getLimit(): number;
    setLimit(value: number): void;

    getAfter(): Uint8Array | string;
    getAfter_asU8(): Uint8Array;
    getAfter_asB64(): string;
    setAfter(value: Uint8Array | string): void;

    getKey(): string;
    setKey(value: string): void;

    getType(): number;
    setType(value: number): void;


    hasIntValue(): boolean;
    clearIntValue(): void;
    getIntValue(): number;
    setIntValue(value: number): void;


    hasBoolValue(): boolean;
    clearBoolValue(): void;
    getBoolValue(): boolean;
    setBoolValue(value: boolean): void;


    hasBinaryValue(): boolean;
    clearBinaryValue(): void;
    getBinaryValue(): Uint8Array | string;
    getBinaryValue_asU8(): Uint8Array;
    getBinaryValue_asB64(): string;
    setBinaryValue(value: Uint8Array | string): void;


    hasStringValue(): boolean;
    clearStringValue(): void;
    getStringValue(): string;
    setStringValue(value: string): void;


    getValueCase(): DataEntriesByAddressRequest.ValueCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DataEntriesByAddressRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DataEntriesByAddressRequest): DataEntriesByAddressRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DataEntriesByAddressRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DataEntriesByAddressRequest;
    static deserializeBinaryFromReader(message: DataEntriesByAddressRequest, reader: jspb.BinaryReader): DataEntriesByAddressRequest;
}

export namespace DataEntriesByAddressRequest {
    export type AsObject = {
        height: number,
        timestamp: number,
        address: Uint8Array | string,
        limit: number,
        after: Uint8Array | string,
        key: string,
        type: number,
        intValue: number,
        boolValue: boolean,
        binaryValue: Uint8Array | string,
        stringValue: string,
    }

    export enum ValueCase {
        VALUE_NOT_SET = 0,
    
    INT_VALUE = 10,

    BOOL_VALUE = 11,

    BINARY_VALUE = 12,

    STRING_VALUE = 13,

    }

}

export class DataEntriesSearchRequest extends jspb.Message { 
    getHeight(): number;
    setHeight(value: number): void;

    getTimestamp(): number;
    setTimestamp(value: number): void;

    getLimit(): number;
    setLimit(value: number): void;

    getAfter(): Uint8Array | string;
    getAfter_asU8(): Uint8Array;
    getAfter_asB64(): string;
    setAfter(value: Uint8Array | string): void;

    getKey(): string;
    setKey(value: string): void;

    getType(): number;
    setType(value: number): void;


    hasIntValue(): boolean;
    clearIntValue(): void;
    getIntValue(): number;
    setIntValue(value: number): void;


    hasBoolValue(): boolean;
    clearBoolValue(): void;
    getBoolValue(): boolean;
    setBoolValue(value: boolean): void;


    hasBinaryValue(): boolean;
    clearBinaryValue(): void;
    getBinaryValue(): Uint8Array | string;
    getBinaryValue_asU8(): Uint8Array;
    getBinaryValue_asB64(): string;
    setBinaryValue(value: Uint8Array | string): void;


    hasStringValue(): boolean;
    clearStringValue(): void;
    getStringValue(): string;
    setStringValue(value: string): void;


    getValueCase(): DataEntriesSearchRequest.ValueCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DataEntriesSearchRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DataEntriesSearchRequest): DataEntriesSearchRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DataEntriesSearchRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DataEntriesSearchRequest;
    static deserializeBinaryFromReader(message: DataEntriesSearchRequest, reader: jspb.BinaryReader): DataEntriesSearchRequest;
}

export namespace DataEntriesSearchRequest {
    export type AsObject = {
        height: number,
        timestamp: number,
        limit: number,
        after: Uint8Array | string,
        key: string,
        type: number,
        intValue: number,
        boolValue: boolean,
        binaryValue: Uint8Array | string,
        stringValue: string,
    }

    export enum ValueCase {
        VALUE_NOT_SET = 0,
    
    INT_VALUE = 10,

    BOOL_VALUE = 11,

    BINARY_VALUE = 12,

    STRING_VALUE = 13,

    }

}

export class DataEntryResponse extends jspb.Message { 
    getAddress(): Uint8Array | string;
    getAddress_asU8(): Uint8Array;
    getAddress_asB64(): string;
    setAddress(value: Uint8Array | string): void;


    hasEntry(): boolean;
    clearEntry(): void;
    getEntry(): transaction_pb.DataTransactionData.DataEntry | undefined;
    setEntry(value?: transaction_pb.DataTransactionData.DataEntry): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DataEntryResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DataEntryResponse): DataEntryResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DataEntryResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DataEntryResponse;
    static deserializeBinaryFromReader(message: DataEntryResponse, reader: jspb.BinaryReader): DataEntryResponse;
}

export namespace DataEntryResponse {
    export type AsObject = {
        address: Uint8Array | string,
        entry?: transaction_pb.DataTransactionData.DataEntry.AsObject,
    }
}
