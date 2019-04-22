// package: 
// file: data-entries.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class GetDataEntriesRequest extends jspb.Message { 
    getTransactionId(): Uint8Array | string;
    getTransactionId_asU8(): Uint8Array;
    getTransactionId_asB64(): string;
    setTransactionId(value: Uint8Array | string): void;

    getHeight(): number;
    setHeight(value: number): void;

    getTimestamp(): number;
    setTimestamp(value: number): void;

    getAddress(): Uint8Array | string;
    getAddress_asU8(): Uint8Array;
    getAddress_asB64(): string;
    setAddress(value: Uint8Array | string): void;


    hasEntry(): boolean;
    clearEntry(): void;
    getEntry(): DataEntry | undefined;
    setEntry(value?: DataEntry): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetDataEntriesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetDataEntriesRequest): GetDataEntriesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetDataEntriesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetDataEntriesRequest;
    static deserializeBinaryFromReader(message: GetDataEntriesRequest, reader: jspb.BinaryReader): GetDataEntriesRequest;
}

export namespace GetDataEntriesRequest {
    export type AsObject = {
        transactionId: Uint8Array | string,
        height: number,
        timestamp: number,
        address: Uint8Array | string,
        entry?: DataEntry.AsObject,
    }
}

export class DataEntry extends jspb.Message { 
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


    getValueCase(): DataEntry.ValueCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DataEntry.AsObject;
    static toObject(includeInstance: boolean, msg: DataEntry): DataEntry.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DataEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DataEntry;
    static deserializeBinaryFromReader(message: DataEntry, reader: jspb.BinaryReader): DataEntry;
}

export namespace DataEntry {
    export type AsObject = {
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
