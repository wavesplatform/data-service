// package: 
// file: balances.proto

/* tslint:disable */

import * as jspb from "google-protobuf";
import * as transaction_pb from "./transaction_pb";

export class BalancesByTransactionRequest extends jspb.Message { 
    getTransactionId(): Uint8Array | string;
    getTransactionId_asU8(): Uint8Array;
    getTransactionId_asB64(): string;
    setTransactionId(value: Uint8Array | string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BalancesByTransactionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: BalancesByTransactionRequest): BalancesByTransactionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BalancesByTransactionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BalancesByTransactionRequest;
    static deserializeBinaryFromReader(message: BalancesByTransactionRequest, reader: jspb.BinaryReader): BalancesByTransactionRequest;
}

export namespace BalancesByTransactionRequest {
    export type AsObject = {
        transactionId: Uint8Array | string,
    }
}

export class BalancesByAddressRequest extends jspb.Message { 
    getHeight(): number;
    setHeight(value: number): void;

    getTimestamp(): number;
    setTimestamp(value: number): void;

    getAddress(): Uint8Array | string;
    getAddress_asU8(): Uint8Array;
    getAddress_asB64(): string;
    setAddress(value: Uint8Array | string): void;

    getAsset(): Uint8Array | string;
    getAsset_asU8(): Uint8Array;
    getAsset_asB64(): string;
    setAsset(value: Uint8Array | string): void;

    getLimit(): number;
    setLimit(value: number): void;

    getAfter(): Uint8Array | string;
    getAfter_asU8(): Uint8Array;
    getAfter_asB64(): string;
    setAfter(value: Uint8Array | string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BalancesByAddressRequest.AsObject;
    static toObject(includeInstance: boolean, msg: BalancesByAddressRequest): BalancesByAddressRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BalancesByAddressRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BalancesByAddressRequest;
    static deserializeBinaryFromReader(message: BalancesByAddressRequest, reader: jspb.BinaryReader): BalancesByAddressRequest;
}

export namespace BalancesByAddressRequest {
    export type AsObject = {
        height: number,
        timestamp: number,
        address: Uint8Array | string,
        asset: Uint8Array | string,
        limit: number,
        after: Uint8Array | string,
    }
}

export class BalancesByAssetRequest extends jspb.Message { 
    getHeight(): number;
    setHeight(value: number): void;

    getTimestamp(): number;
    setTimestamp(value: number): void;

    getAsset(): Uint8Array | string;
    getAsset_asU8(): Uint8Array;
    getAsset_asB64(): string;
    setAsset(value: Uint8Array | string): void;

    getLimit(): number;
    setLimit(value: number): void;

    getAfter(): Uint8Array | string;
    getAfter_asU8(): Uint8Array;
    getAfter_asB64(): string;
    setAfter(value: Uint8Array | string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BalancesByAssetRequest.AsObject;
    static toObject(includeInstance: boolean, msg: BalancesByAssetRequest): BalancesByAssetRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BalancesByAssetRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BalancesByAssetRequest;
    static deserializeBinaryFromReader(message: BalancesByAssetRequest, reader: jspb.BinaryReader): BalancesByAssetRequest;
}

export namespace BalancesByAssetRequest {
    export type AsObject = {
        height: number,
        timestamp: number,
        asset: Uint8Array | string,
        limit: number,
        after: Uint8Array | string,
    }
}

export class Balance extends jspb.Message { 
    getAddress(): Uint8Array | string;
    getAddress_asU8(): Uint8Array;
    getAddress_asB64(): string;
    setAddress(value: Uint8Array | string): void;


    hasAmount(): boolean;
    clearAmount(): void;
    getAmount(): transaction_pb.Amount | undefined;
    setAmount(value?: transaction_pb.Amount): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Balance.AsObject;
    static toObject(includeInstance: boolean, msg: Balance): Balance.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Balance, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Balance;
    static deserializeBinaryFromReader(message: Balance, reader: jspb.BinaryReader): Balance;
}

export namespace Balance {
    export type AsObject = {
        address: Uint8Array | string,
        amount?: transaction_pb.Amount.AsObject,
    }
}
