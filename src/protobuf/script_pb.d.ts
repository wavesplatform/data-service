// package: 
// file: script.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class Script extends jspb.Message { 
    getBytes(): Uint8Array | string;
    getBytes_asU8(): Uint8Array;
    getBytes_asB64(): string;
    setBytes(value: Uint8Array | string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Script.AsObject;
    static toObject(includeInstance: boolean, msg: Script): Script.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Script, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Script;
    static deserializeBinaryFromReader(message: Script, reader: jspb.BinaryReader): Script;
}

export namespace Script {
    export type AsObject = {
        bytes: Uint8Array | string,
    }
}
