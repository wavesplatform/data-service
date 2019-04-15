// package: 
// file: recipient.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class Recipient extends jspb.Message { 

    hasAddress(): boolean;
    clearAddress(): void;
    getAddress(): Uint8Array | string;
    getAddress_asU8(): Uint8Array;
    getAddress_asB64(): string;
    setAddress(value: Uint8Array | string): void;


    hasAlias(): boolean;
    clearAlias(): void;
    getAlias(): string;
    setAlias(value: string): void;


    getRecipientCase(): Recipient.RecipientCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Recipient.AsObject;
    static toObject(includeInstance: boolean, msg: Recipient): Recipient.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Recipient, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Recipient;
    static deserializeBinaryFromReader(message: Recipient, reader: jspb.BinaryReader): Recipient;
}

export namespace Recipient {
    export type AsObject = {
        address: Uint8Array | string,
        alias: string,
    }

    export enum RecipientCase {
        RECIPIENT_NOT_SET = 0,
    
    ADDRESS = 1,

    ALIAS = 2,

    }

}
