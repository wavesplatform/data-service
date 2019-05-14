// package: 
// file: balances.proto

/* tslint:disable */

import * as jspb from "google-protobuf";
import * as transaction_pb from "./transaction_pb";

export class GetBalancesRequest extends jspb.Message { 
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

    getAssetId(): Uint8Array | string;
    getAssetId_asU8(): Uint8Array;
    getAssetId_asB64(): string;
    setAssetId(value: Uint8Array | string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBalancesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetBalancesRequest): GetBalancesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBalancesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBalancesRequest;
    static deserializeBinaryFromReader(message: GetBalancesRequest, reader: jspb.BinaryReader): GetBalancesRequest;
}

export namespace GetBalancesRequest {
    export type AsObject = {
        transactionId: Uint8Array | string,
        height: number,
        timestamp: number,
        address: Uint8Array | string,
        assetId: Uint8Array | string,
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
