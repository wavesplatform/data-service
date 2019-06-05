import * as $protobuf from "protobufjs";
/** Properties of a DataEntriesByTransactionRequest. */
export interface IDataEntriesByTransactionRequest {

    /** DataEntriesByTransactionRequest transactionId */
    transactionId?: (Uint8Array|null);
}

/** Represents a DataEntriesByTransactionRequest. */
export class DataEntriesByTransactionRequest implements IDataEntriesByTransactionRequest {

    /**
     * Constructs a new DataEntriesByTransactionRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDataEntriesByTransactionRequest);

    /** DataEntriesByTransactionRequest transactionId. */
    public transactionId: Uint8Array;

    /**
     * Creates a new DataEntriesByTransactionRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DataEntriesByTransactionRequest instance
     */
    public static create(properties?: IDataEntriesByTransactionRequest): DataEntriesByTransactionRequest;

    /**
     * Encodes the specified DataEntriesByTransactionRequest message. Does not implicitly {@link DataEntriesByTransactionRequest.verify|verify} messages.
     * @param message DataEntriesByTransactionRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDataEntriesByTransactionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DataEntriesByTransactionRequest message, length delimited. Does not implicitly {@link DataEntriesByTransactionRequest.verify|verify} messages.
     * @param message DataEntriesByTransactionRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDataEntriesByTransactionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DataEntriesByTransactionRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DataEntriesByTransactionRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DataEntriesByTransactionRequest;

    /**
     * Decodes a DataEntriesByTransactionRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DataEntriesByTransactionRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DataEntriesByTransactionRequest;

    /**
     * Verifies a DataEntriesByTransactionRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DataEntriesByTransactionRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DataEntriesByTransactionRequest
     */
    public static fromObject(object: { [k: string]: any }): DataEntriesByTransactionRequest;

    /**
     * Creates a plain object from a DataEntriesByTransactionRequest message. Also converts values to other types if specified.
     * @param message DataEntriesByTransactionRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DataEntriesByTransactionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DataEntriesByTransactionRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a DataEntriesByAddressRequest. */
export interface IDataEntriesByAddressRequest {

    /** DataEntriesByAddressRequest height */
    height?: (number|null);

    /** DataEntriesByAddressRequest timestamp */
    timestamp?: (Long|null);

    /** DataEntriesByAddressRequest address */
    address?: (Uint8Array|null);

    /** DataEntriesByAddressRequest limit */
    limit?: (number|null);

    /** DataEntriesByAddressRequest after */
    after?: (Uint8Array|null);

    /** DataEntriesByAddressRequest key */
    key?: (string|null);

    /** DataEntriesByAddressRequest type */
    type?: (number|null);

    /** DataEntriesByAddressRequest intValue */
    intValue?: (Long|null);

    /** DataEntriesByAddressRequest boolValue */
    boolValue?: (boolean|null);

    /** DataEntriesByAddressRequest binaryValue */
    binaryValue?: (Uint8Array|null);

    /** DataEntriesByAddressRequest stringValue */
    stringValue?: (string|null);
}

/** Represents a DataEntriesByAddressRequest. */
export class DataEntriesByAddressRequest implements IDataEntriesByAddressRequest {

    /**
     * Constructs a new DataEntriesByAddressRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDataEntriesByAddressRequest);

    /** DataEntriesByAddressRequest height. */
    public height: number;

    /** DataEntriesByAddressRequest timestamp. */
    public timestamp: Long;

    /** DataEntriesByAddressRequest address. */
    public address: Uint8Array;

    /** DataEntriesByAddressRequest limit. */
    public limit: number;

    /** DataEntriesByAddressRequest after. */
    public after: Uint8Array;

    /** DataEntriesByAddressRequest key. */
    public key: string;

    /** DataEntriesByAddressRequest type. */
    public type: number;

    /** DataEntriesByAddressRequest intValue. */
    public intValue: Long;

    /** DataEntriesByAddressRequest boolValue. */
    public boolValue: boolean;

    /** DataEntriesByAddressRequest binaryValue. */
    public binaryValue: Uint8Array;

    /** DataEntriesByAddressRequest stringValue. */
    public stringValue: string;

    /** DataEntriesByAddressRequest value. */
    public value?: ("intValue"|"boolValue"|"binaryValue"|"stringValue");

    /**
     * Creates a new DataEntriesByAddressRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DataEntriesByAddressRequest instance
     */
    public static create(properties?: IDataEntriesByAddressRequest): DataEntriesByAddressRequest;

    /**
     * Encodes the specified DataEntriesByAddressRequest message. Does not implicitly {@link DataEntriesByAddressRequest.verify|verify} messages.
     * @param message DataEntriesByAddressRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDataEntriesByAddressRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DataEntriesByAddressRequest message, length delimited. Does not implicitly {@link DataEntriesByAddressRequest.verify|verify} messages.
     * @param message DataEntriesByAddressRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDataEntriesByAddressRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DataEntriesByAddressRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DataEntriesByAddressRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DataEntriesByAddressRequest;

    /**
     * Decodes a DataEntriesByAddressRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DataEntriesByAddressRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DataEntriesByAddressRequest;

    /**
     * Verifies a DataEntriesByAddressRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DataEntriesByAddressRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DataEntriesByAddressRequest
     */
    public static fromObject(object: { [k: string]: any }): DataEntriesByAddressRequest;

    /**
     * Creates a plain object from a DataEntriesByAddressRequest message. Also converts values to other types if specified.
     * @param message DataEntriesByAddressRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DataEntriesByAddressRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DataEntriesByAddressRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a DataEntriesSearchRequest. */
export interface IDataEntriesSearchRequest {

    /** DataEntriesSearchRequest height */
    height?: (number|null);

    /** DataEntriesSearchRequest timestamp */
    timestamp?: (Long|null);

    /** DataEntriesSearchRequest limit */
    limit?: (number|null);

    /** DataEntriesSearchRequest after */
    after?: (Uint8Array|null);

    /** DataEntriesSearchRequest key */
    key?: (string|null);

    /** DataEntriesSearchRequest type */
    type?: (number|null);

    /** DataEntriesSearchRequest intValue */
    intValue?: (Long|null);

    /** DataEntriesSearchRequest boolValue */
    boolValue?: (boolean|null);

    /** DataEntriesSearchRequest binaryValue */
    binaryValue?: (Uint8Array|null);

    /** DataEntriesSearchRequest stringValue */
    stringValue?: (string|null);
}

/** Represents a DataEntriesSearchRequest. */
export class DataEntriesSearchRequest implements IDataEntriesSearchRequest {

    /**
     * Constructs a new DataEntriesSearchRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDataEntriesSearchRequest);

    /** DataEntriesSearchRequest height. */
    public height: number;

    /** DataEntriesSearchRequest timestamp. */
    public timestamp: Long;

    /** DataEntriesSearchRequest limit. */
    public limit: number;

    /** DataEntriesSearchRequest after. */
    public after: Uint8Array;

    /** DataEntriesSearchRequest key. */
    public key: string;

    /** DataEntriesSearchRequest type. */
    public type: number;

    /** DataEntriesSearchRequest intValue. */
    public intValue: Long;

    /** DataEntriesSearchRequest boolValue. */
    public boolValue: boolean;

    /** DataEntriesSearchRequest binaryValue. */
    public binaryValue: Uint8Array;

    /** DataEntriesSearchRequest stringValue. */
    public stringValue: string;

    /** DataEntriesSearchRequest value. */
    public value?: ("intValue"|"boolValue"|"binaryValue"|"stringValue");

    /**
     * Creates a new DataEntriesSearchRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DataEntriesSearchRequest instance
     */
    public static create(properties?: IDataEntriesSearchRequest): DataEntriesSearchRequest;

    /**
     * Encodes the specified DataEntriesSearchRequest message. Does not implicitly {@link DataEntriesSearchRequest.verify|verify} messages.
     * @param message DataEntriesSearchRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDataEntriesSearchRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DataEntriesSearchRequest message, length delimited. Does not implicitly {@link DataEntriesSearchRequest.verify|verify} messages.
     * @param message DataEntriesSearchRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDataEntriesSearchRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DataEntriesSearchRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DataEntriesSearchRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DataEntriesSearchRequest;

    /**
     * Decodes a DataEntriesSearchRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DataEntriesSearchRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DataEntriesSearchRequest;

    /**
     * Verifies a DataEntriesSearchRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DataEntriesSearchRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DataEntriesSearchRequest
     */
    public static fromObject(object: { [k: string]: any }): DataEntriesSearchRequest;

    /**
     * Creates a plain object from a DataEntriesSearchRequest message. Also converts values to other types if specified.
     * @param message DataEntriesSearchRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DataEntriesSearchRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DataEntriesSearchRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a DataEntryResponse. */
export interface IDataEntryResponse {

    /** DataEntryResponse address */
    address?: (Uint8Array|null);

    /** DataEntryResponse entry */
    entry?: (DataTransactionData.IDataEntry|null);
}

/** Represents a DataEntryResponse. */
export class DataEntryResponse implements IDataEntryResponse {

    /**
     * Constructs a new DataEntryResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDataEntryResponse);

    /** DataEntryResponse address. */
    public address: Uint8Array;

    /** DataEntryResponse entry. */
    public entry?: (DataTransactionData.IDataEntry|null);

    /**
     * Creates a new DataEntryResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DataEntryResponse instance
     */
    public static create(properties?: IDataEntryResponse): DataEntryResponse;

    /**
     * Encodes the specified DataEntryResponse message. Does not implicitly {@link DataEntryResponse.verify|verify} messages.
     * @param message DataEntryResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDataEntryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DataEntryResponse message, length delimited. Does not implicitly {@link DataEntryResponse.verify|verify} messages.
     * @param message DataEntryResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDataEntryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DataEntryResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DataEntryResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DataEntryResponse;

    /**
     * Decodes a DataEntryResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DataEntryResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DataEntryResponse;

    /**
     * Verifies a DataEntryResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DataEntryResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DataEntryResponse
     */
    public static fromObject(object: { [k: string]: any }): DataEntryResponse;

    /**
     * Creates a plain object from a DataEntryResponse message. Also converts values to other types if specified.
     * @param message DataEntryResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DataEntryResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DataEntryResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Represents a DataEntries */
export class DataEntries extends $protobuf.rpc.Service {

    /**
     * Constructs a new DataEntries service.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     */
    constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

    /**
     * Creates new DataEntries service using the specified rpc implementation.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     * @returns RPC service. Useful where requests and/or responses are streamed.
     */
    public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): DataEntries;

    /**
     * Calls ByTransaction.
     * @param request DataEntriesByTransactionRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and DataEntryResponse
     */
    public byTransaction(request: IDataEntriesByTransactionRequest, callback: DataEntries.ByTransactionCallback): void;

    /**
     * Calls ByTransaction.
     * @param request DataEntriesByTransactionRequest message or plain object
     * @returns Promise
     */
    public byTransaction(request: IDataEntriesByTransactionRequest): Promise<DataEntryResponse>;

    /**
     * Calls ByAddress.
     * @param request DataEntriesByAddressRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and DataEntryResponse
     */
    public byAddress(request: IDataEntriesByAddressRequest, callback: DataEntries.ByAddressCallback): void;

    /**
     * Calls ByAddress.
     * @param request DataEntriesByAddressRequest message or plain object
     * @returns Promise
     */
    public byAddress(request: IDataEntriesByAddressRequest): Promise<DataEntryResponse>;

    /**
     * Calls Search.
     * @param request DataEntriesSearchRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and DataEntryResponse
     */
    public search(request: IDataEntriesSearchRequest, callback: DataEntries.SearchCallback): void;

    /**
     * Calls Search.
     * @param request DataEntriesSearchRequest message or plain object
     * @returns Promise
     */
    public search(request: IDataEntriesSearchRequest): Promise<DataEntryResponse>;
}

export namespace DataEntries {

    /**
     * Callback as used by {@link DataEntries#byTransaction}.
     * @param error Error, if any
     * @param [response] DataEntryResponse
     */
    type ByTransactionCallback = (error: (Error|null), response?: DataEntryResponse) => void;

    /**
     * Callback as used by {@link DataEntries#byAddress}.
     * @param error Error, if any
     * @param [response] DataEntryResponse
     */
    type ByAddressCallback = (error: (Error|null), response?: DataEntryResponse) => void;

    /**
     * Callback as used by {@link DataEntries#search}.
     * @param error Error, if any
     * @param [response] DataEntryResponse
     */
    type SearchCallback = (error: (Error|null), response?: DataEntryResponse) => void;
}

/** Properties of an AssetId. */
export interface IAssetId {

    /** AssetId waves */
    waves?: (google.protobuf.IEmpty|null);

    /** AssetId issuedAsset */
    issuedAsset?: (Uint8Array|null);
}

/** Represents an AssetId. */
export class AssetId implements IAssetId {

    /**
     * Constructs a new AssetId.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAssetId);

    /** AssetId waves. */
    public waves?: (google.protobuf.IEmpty|null);

    /** AssetId issuedAsset. */
    public issuedAsset: Uint8Array;

    /** AssetId asset. */
    public asset?: ("waves"|"issuedAsset");

    /**
     * Creates a new AssetId instance using the specified properties.
     * @param [properties] Properties to set
     * @returns AssetId instance
     */
    public static create(properties?: IAssetId): AssetId;

    /**
     * Encodes the specified AssetId message. Does not implicitly {@link AssetId.verify|verify} messages.
     * @param message AssetId message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IAssetId, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified AssetId message, length delimited. Does not implicitly {@link AssetId.verify|verify} messages.
     * @param message AssetId message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IAssetId, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an AssetId message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns AssetId
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AssetId;

    /**
     * Decodes an AssetId message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns AssetId
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AssetId;

    /**
     * Verifies an AssetId message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an AssetId message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns AssetId
     */
    public static fromObject(object: { [k: string]: any }): AssetId;

    /**
     * Creates a plain object from an AssetId message. Also converts values to other types if specified.
     * @param message AssetId
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: AssetId, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this AssetId to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an AssetAmount. */
export interface IAssetAmount {

    /** AssetAmount assetId */
    assetId?: (Uint8Array|null);

    /** AssetAmount amount */
    amount?: (Long|null);
}

/** Represents an AssetAmount. */
export class AssetAmount implements IAssetAmount {

    /**
     * Constructs a new AssetAmount.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAssetAmount);

    /** AssetAmount assetId. */
    public assetId: Uint8Array;

    /** AssetAmount amount. */
    public amount: Long;

    /**
     * Creates a new AssetAmount instance using the specified properties.
     * @param [properties] Properties to set
     * @returns AssetAmount instance
     */
    public static create(properties?: IAssetAmount): AssetAmount;

    /**
     * Encodes the specified AssetAmount message. Does not implicitly {@link AssetAmount.verify|verify} messages.
     * @param message AssetAmount message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IAssetAmount, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified AssetAmount message, length delimited. Does not implicitly {@link AssetAmount.verify|verify} messages.
     * @param message AssetAmount message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IAssetAmount, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an AssetAmount message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns AssetAmount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AssetAmount;

    /**
     * Decodes an AssetAmount message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns AssetAmount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AssetAmount;

    /**
     * Verifies an AssetAmount message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an AssetAmount message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns AssetAmount
     */
    public static fromObject(object: { [k: string]: any }): AssetAmount;

    /**
     * Creates a plain object from an AssetAmount message. Also converts values to other types if specified.
     * @param message AssetAmount
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: AssetAmount, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this AssetAmount to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an Amount. */
export interface IAmount {

    /** Amount assetId */
    assetId?: (IAssetId|null);

    /** Amount amount */
    amount?: (Long|null);
}

/** Represents an Amount. */
export class Amount implements IAmount {

    /**
     * Constructs a new Amount.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAmount);

    /** Amount assetId. */
    public assetId?: (IAssetId|null);

    /** Amount amount. */
    public amount: Long;

    /**
     * Creates a new Amount instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Amount instance
     */
    public static create(properties?: IAmount): Amount;

    /**
     * Encodes the specified Amount message. Does not implicitly {@link Amount.verify|verify} messages.
     * @param message Amount message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IAmount, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Amount message, length delimited. Does not implicitly {@link Amount.verify|verify} messages.
     * @param message Amount message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IAmount, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Amount message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Amount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Amount;

    /**
     * Decodes an Amount message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Amount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Amount;

    /**
     * Verifies an Amount message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Amount message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Amount
     */
    public static fromObject(object: { [k: string]: any }): Amount;

    /**
     * Creates a plain object from an Amount message. Also converts values to other types if specified.
     * @param message Amount
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Amount, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Amount to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SignedTransaction. */
export interface ISignedTransaction {

    /** SignedTransaction transaction */
    transaction?: (ITransaction|null);

    /** SignedTransaction proofs */
    proofs?: (Uint8Array[]|null);
}

/** Represents a SignedTransaction. */
export class SignedTransaction implements ISignedTransaction {

    /**
     * Constructs a new SignedTransaction.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISignedTransaction);

    /** SignedTransaction transaction. */
    public transaction?: (ITransaction|null);

    /** SignedTransaction proofs. */
    public proofs: Uint8Array[];

    /**
     * Creates a new SignedTransaction instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SignedTransaction instance
     */
    public static create(properties?: ISignedTransaction): SignedTransaction;

    /**
     * Encodes the specified SignedTransaction message. Does not implicitly {@link SignedTransaction.verify|verify} messages.
     * @param message SignedTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISignedTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SignedTransaction message, length delimited. Does not implicitly {@link SignedTransaction.verify|verify} messages.
     * @param message SignedTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISignedTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SignedTransaction message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SignedTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SignedTransaction;

    /**
     * Decodes a SignedTransaction message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SignedTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SignedTransaction;

    /**
     * Verifies a SignedTransaction message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SignedTransaction message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SignedTransaction
     */
    public static fromObject(object: { [k: string]: any }): SignedTransaction;

    /**
     * Creates a plain object from a SignedTransaction message. Also converts values to other types if specified.
     * @param message SignedTransaction
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SignedTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SignedTransaction to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Transaction. */
export interface ITransaction {

    /** Transaction chainId */
    chainId?: (number|null);

    /** Transaction senderPublicKey */
    senderPublicKey?: (Uint8Array|null);

    /** Transaction fee */
    fee?: (IAmount|null);

    /** Transaction timestamp */
    timestamp?: (Long|null);

    /** Transaction version */
    version?: (number|null);

    /** Transaction genesis */
    genesis?: (IGenesisTransactionData|null);

    /** Transaction payment */
    payment?: (IPaymentTransactionData|null);

    /** Transaction issue */
    issue?: (IIssueTransactionData|null);

    /** Transaction transfer */
    transfer?: (ITransferTransactionData|null);

    /** Transaction reissue */
    reissue?: (IReissueTransactionData|null);

    /** Transaction burn */
    burn?: (IBurnTransactionData|null);

    /** Transaction exchange */
    exchange?: (IExchangeTransactionData|null);

    /** Transaction lease */
    lease?: (ILeaseTransactionData|null);

    /** Transaction leaseCancel */
    leaseCancel?: (ILeaseCancelTransactionData|null);

    /** Transaction createAlias */
    createAlias?: (ICreateAliasTransactionData|null);

    /** Transaction massTransfer */
    massTransfer?: (IMassTransferTransactionData|null);

    /** Transaction dataTransaction */
    dataTransaction?: (IDataTransactionData|null);

    /** Transaction setScript */
    setScript?: (ISetScriptTransactionData|null);

    /** Transaction sponsorFee */
    sponsorFee?: (ISponsorFeeTransactionData|null);

    /** Transaction setAssetScript */
    setAssetScript?: (ISetAssetScriptTransactionData|null);

    /** Transaction invokeScript */
    invokeScript?: (IInvokeScriptTransactionData|null);
}

/** Represents a Transaction. */
export class Transaction implements ITransaction {

    /**
     * Constructs a new Transaction.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITransaction);

    /** Transaction chainId. */
    public chainId: number;

    /** Transaction senderPublicKey. */
    public senderPublicKey: Uint8Array;

    /** Transaction fee. */
    public fee?: (IAmount|null);

    /** Transaction timestamp. */
    public timestamp: Long;

    /** Transaction version. */
    public version: number;

    /** Transaction genesis. */
    public genesis?: (IGenesisTransactionData|null);

    /** Transaction payment. */
    public payment?: (IPaymentTransactionData|null);

    /** Transaction issue. */
    public issue?: (IIssueTransactionData|null);

    /** Transaction transfer. */
    public transfer?: (ITransferTransactionData|null);

    /** Transaction reissue. */
    public reissue?: (IReissueTransactionData|null);

    /** Transaction burn. */
    public burn?: (IBurnTransactionData|null);

    /** Transaction exchange. */
    public exchange?: (IExchangeTransactionData|null);

    /** Transaction lease. */
    public lease?: (ILeaseTransactionData|null);

    /** Transaction leaseCancel. */
    public leaseCancel?: (ILeaseCancelTransactionData|null);

    /** Transaction createAlias. */
    public createAlias?: (ICreateAliasTransactionData|null);

    /** Transaction massTransfer. */
    public massTransfer?: (IMassTransferTransactionData|null);

    /** Transaction dataTransaction. */
    public dataTransaction?: (IDataTransactionData|null);

    /** Transaction setScript. */
    public setScript?: (ISetScriptTransactionData|null);

    /** Transaction sponsorFee. */
    public sponsorFee?: (ISponsorFeeTransactionData|null);

    /** Transaction setAssetScript. */
    public setAssetScript?: (ISetAssetScriptTransactionData|null);

    /** Transaction invokeScript. */
    public invokeScript?: (IInvokeScriptTransactionData|null);

    /** Transaction data. */
    public data?: ("genesis"|"payment"|"issue"|"transfer"|"reissue"|"burn"|"exchange"|"lease"|"leaseCancel"|"createAlias"|"massTransfer"|"dataTransaction"|"setScript"|"sponsorFee"|"setAssetScript"|"invokeScript");

    /**
     * Creates a new Transaction instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Transaction instance
     */
    public static create(properties?: ITransaction): Transaction;

    /**
     * Encodes the specified Transaction message. Does not implicitly {@link Transaction.verify|verify} messages.
     * @param message Transaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Transaction message, length delimited. Does not implicitly {@link Transaction.verify|verify} messages.
     * @param message Transaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Transaction message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Transaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Transaction;

    /**
     * Decodes a Transaction message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Transaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Transaction;

    /**
     * Verifies a Transaction message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Transaction message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Transaction
     */
    public static fromObject(object: { [k: string]: any }): Transaction;

    /**
     * Creates a plain object from a Transaction message. Also converts values to other types if specified.
     * @param message Transaction
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Transaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Transaction to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a GenesisTransactionData. */
export interface IGenesisTransactionData {

    /** GenesisTransactionData recipientAddress */
    recipientAddress?: (Uint8Array|null);

    /** GenesisTransactionData amount */
    amount?: (Long|null);
}

/** Represents a GenesisTransactionData. */
export class GenesisTransactionData implements IGenesisTransactionData {

    /**
     * Constructs a new GenesisTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGenesisTransactionData);

    /** GenesisTransactionData recipientAddress. */
    public recipientAddress: Uint8Array;

    /** GenesisTransactionData amount. */
    public amount: Long;

    /**
     * Creates a new GenesisTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GenesisTransactionData instance
     */
    public static create(properties?: IGenesisTransactionData): GenesisTransactionData;

    /**
     * Encodes the specified GenesisTransactionData message. Does not implicitly {@link GenesisTransactionData.verify|verify} messages.
     * @param message GenesisTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGenesisTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GenesisTransactionData message, length delimited. Does not implicitly {@link GenesisTransactionData.verify|verify} messages.
     * @param message GenesisTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGenesisTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GenesisTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GenesisTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GenesisTransactionData;

    /**
     * Decodes a GenesisTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GenesisTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GenesisTransactionData;

    /**
     * Verifies a GenesisTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GenesisTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GenesisTransactionData
     */
    public static fromObject(object: { [k: string]: any }): GenesisTransactionData;

    /**
     * Creates a plain object from a GenesisTransactionData message. Also converts values to other types if specified.
     * @param message GenesisTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GenesisTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GenesisTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PaymentTransactionData. */
export interface IPaymentTransactionData {

    /** PaymentTransactionData recipientAddress */
    recipientAddress?: (Uint8Array|null);

    /** PaymentTransactionData amount */
    amount?: (Long|null);
}

/** Represents a PaymentTransactionData. */
export class PaymentTransactionData implements IPaymentTransactionData {

    /**
     * Constructs a new PaymentTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPaymentTransactionData);

    /** PaymentTransactionData recipientAddress. */
    public recipientAddress: Uint8Array;

    /** PaymentTransactionData amount. */
    public amount: Long;

    /**
     * Creates a new PaymentTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PaymentTransactionData instance
     */
    public static create(properties?: IPaymentTransactionData): PaymentTransactionData;

    /**
     * Encodes the specified PaymentTransactionData message. Does not implicitly {@link PaymentTransactionData.verify|verify} messages.
     * @param message PaymentTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPaymentTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PaymentTransactionData message, length delimited. Does not implicitly {@link PaymentTransactionData.verify|verify} messages.
     * @param message PaymentTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPaymentTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PaymentTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PaymentTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PaymentTransactionData;

    /**
     * Decodes a PaymentTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PaymentTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PaymentTransactionData;

    /**
     * Verifies a PaymentTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PaymentTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PaymentTransactionData
     */
    public static fromObject(object: { [k: string]: any }): PaymentTransactionData;

    /**
     * Creates a plain object from a PaymentTransactionData message. Also converts values to other types if specified.
     * @param message PaymentTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PaymentTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PaymentTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a TransferTransactionData. */
export interface ITransferTransactionData {

    /** TransferTransactionData recipient */
    recipient?: (IRecipient|null);

    /** TransferTransactionData amount */
    amount?: (IAmount|null);

    /** TransferTransactionData attachment */
    attachment?: (Uint8Array|null);
}

/** Represents a TransferTransactionData. */
export class TransferTransactionData implements ITransferTransactionData {

    /**
     * Constructs a new TransferTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITransferTransactionData);

    /** TransferTransactionData recipient. */
    public recipient?: (IRecipient|null);

    /** TransferTransactionData amount. */
    public amount?: (IAmount|null);

    /** TransferTransactionData attachment. */
    public attachment: Uint8Array;

    /**
     * Creates a new TransferTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TransferTransactionData instance
     */
    public static create(properties?: ITransferTransactionData): TransferTransactionData;

    /**
     * Encodes the specified TransferTransactionData message. Does not implicitly {@link TransferTransactionData.verify|verify} messages.
     * @param message TransferTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ITransferTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified TransferTransactionData message, length delimited. Does not implicitly {@link TransferTransactionData.verify|verify} messages.
     * @param message TransferTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ITransferTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a TransferTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns TransferTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): TransferTransactionData;

    /**
     * Decodes a TransferTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns TransferTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): TransferTransactionData;

    /**
     * Verifies a TransferTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a TransferTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TransferTransactionData
     */
    public static fromObject(object: { [k: string]: any }): TransferTransactionData;

    /**
     * Creates a plain object from a TransferTransactionData message. Also converts values to other types if specified.
     * @param message TransferTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: TransferTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this TransferTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CreateAliasTransactionData. */
export interface ICreateAliasTransactionData {

    /** CreateAliasTransactionData alias */
    alias?: (string|null);
}

/** Represents a CreateAliasTransactionData. */
export class CreateAliasTransactionData implements ICreateAliasTransactionData {

    /**
     * Constructs a new CreateAliasTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICreateAliasTransactionData);

    /** CreateAliasTransactionData alias. */
    public alias: string;

    /**
     * Creates a new CreateAliasTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CreateAliasTransactionData instance
     */
    public static create(properties?: ICreateAliasTransactionData): CreateAliasTransactionData;

    /**
     * Encodes the specified CreateAliasTransactionData message. Does not implicitly {@link CreateAliasTransactionData.verify|verify} messages.
     * @param message CreateAliasTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICreateAliasTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CreateAliasTransactionData message, length delimited. Does not implicitly {@link CreateAliasTransactionData.verify|verify} messages.
     * @param message CreateAliasTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICreateAliasTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CreateAliasTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CreateAliasTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CreateAliasTransactionData;

    /**
     * Decodes a CreateAliasTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CreateAliasTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CreateAliasTransactionData;

    /**
     * Verifies a CreateAliasTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CreateAliasTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CreateAliasTransactionData
     */
    public static fromObject(object: { [k: string]: any }): CreateAliasTransactionData;

    /**
     * Creates a plain object from a CreateAliasTransactionData message. Also converts values to other types if specified.
     * @param message CreateAliasTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CreateAliasTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CreateAliasTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a DataTransactionData. */
export interface IDataTransactionData {

    /** DataTransactionData data */
    data?: (DataTransactionData.IDataEntry[]|null);
}

/** Represents a DataTransactionData. */
export class DataTransactionData implements IDataTransactionData {

    /**
     * Constructs a new DataTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDataTransactionData);

    /** DataTransactionData data. */
    public data: DataTransactionData.IDataEntry[];

    /**
     * Creates a new DataTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DataTransactionData instance
     */
    public static create(properties?: IDataTransactionData): DataTransactionData;

    /**
     * Encodes the specified DataTransactionData message. Does not implicitly {@link DataTransactionData.verify|verify} messages.
     * @param message DataTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDataTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DataTransactionData message, length delimited. Does not implicitly {@link DataTransactionData.verify|verify} messages.
     * @param message DataTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDataTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DataTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DataTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DataTransactionData;

    /**
     * Decodes a DataTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DataTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DataTransactionData;

    /**
     * Verifies a DataTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DataTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DataTransactionData
     */
    public static fromObject(object: { [k: string]: any }): DataTransactionData;

    /**
     * Creates a plain object from a DataTransactionData message. Also converts values to other types if specified.
     * @param message DataTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DataTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DataTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace DataTransactionData {

    /** Properties of a DataEntry. */
    interface IDataEntry {

        /** DataEntry key */
        key?: (string|null);

        /** DataEntry intValue */
        intValue?: (Long|null);

        /** DataEntry boolValue */
        boolValue?: (boolean|null);

        /** DataEntry binaryValue */
        binaryValue?: (Uint8Array|null);

        /** DataEntry stringValue */
        stringValue?: (string|null);
    }

    /** Represents a DataEntry. */
    class DataEntry implements IDataEntry {

        /**
         * Constructs a new DataEntry.
         * @param [properties] Properties to set
         */
        constructor(properties?: DataTransactionData.IDataEntry);

        /** DataEntry key. */
        public key: string;

        /** DataEntry intValue. */
        public intValue: Long;

        /** DataEntry boolValue. */
        public boolValue: boolean;

        /** DataEntry binaryValue. */
        public binaryValue: Uint8Array;

        /** DataEntry stringValue. */
        public stringValue: string;

        /** DataEntry value. */
        public value?: ("intValue"|"boolValue"|"binaryValue"|"stringValue");

        /**
         * Creates a new DataEntry instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DataEntry instance
         */
        public static create(properties?: DataTransactionData.IDataEntry): DataTransactionData.DataEntry;

        /**
         * Encodes the specified DataEntry message. Does not implicitly {@link DataTransactionData.DataEntry.verify|verify} messages.
         * @param message DataEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: DataTransactionData.IDataEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DataEntry message, length delimited. Does not implicitly {@link DataTransactionData.DataEntry.verify|verify} messages.
         * @param message DataEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: DataTransactionData.IDataEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DataEntry message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DataEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DataTransactionData.DataEntry;

        /**
         * Decodes a DataEntry message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DataEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DataTransactionData.DataEntry;

        /**
         * Verifies a DataEntry message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DataEntry message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DataEntry
         */
        public static fromObject(object: { [k: string]: any }): DataTransactionData.DataEntry;

        /**
         * Creates a plain object from a DataEntry message. Also converts values to other types if specified.
         * @param message DataEntry
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: DataTransactionData.DataEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DataEntry to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of a MassTransferTransactionData. */
export interface IMassTransferTransactionData {

    /** MassTransferTransactionData assetId */
    assetId?: (IAssetId|null);

    /** MassTransferTransactionData transfers */
    transfers?: (MassTransferTransactionData.ITransfer[]|null);

    /** MassTransferTransactionData attachment */
    attachment?: (Uint8Array|null);
}

/** Represents a MassTransferTransactionData. */
export class MassTransferTransactionData implements IMassTransferTransactionData {

    /**
     * Constructs a new MassTransferTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMassTransferTransactionData);

    /** MassTransferTransactionData assetId. */
    public assetId?: (IAssetId|null);

    /** MassTransferTransactionData transfers. */
    public transfers: MassTransferTransactionData.ITransfer[];

    /** MassTransferTransactionData attachment. */
    public attachment: Uint8Array;

    /**
     * Creates a new MassTransferTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MassTransferTransactionData instance
     */
    public static create(properties?: IMassTransferTransactionData): MassTransferTransactionData;

    /**
     * Encodes the specified MassTransferTransactionData message. Does not implicitly {@link MassTransferTransactionData.verify|verify} messages.
     * @param message MassTransferTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMassTransferTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified MassTransferTransactionData message, length delimited. Does not implicitly {@link MassTransferTransactionData.verify|verify} messages.
     * @param message MassTransferTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMassTransferTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a MassTransferTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MassTransferTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MassTransferTransactionData;

    /**
     * Decodes a MassTransferTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MassTransferTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MassTransferTransactionData;

    /**
     * Verifies a MassTransferTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a MassTransferTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MassTransferTransactionData
     */
    public static fromObject(object: { [k: string]: any }): MassTransferTransactionData;

    /**
     * Creates a plain object from a MassTransferTransactionData message. Also converts values to other types if specified.
     * @param message MassTransferTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MassTransferTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this MassTransferTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace MassTransferTransactionData {

    /** Properties of a Transfer. */
    interface ITransfer {

        /** Transfer address */
        address?: (IRecipient|null);

        /** Transfer amount */
        amount?: (Long|null);
    }

    /** Represents a Transfer. */
    class Transfer implements ITransfer {

        /**
         * Constructs a new Transfer.
         * @param [properties] Properties to set
         */
        constructor(properties?: MassTransferTransactionData.ITransfer);

        /** Transfer address. */
        public address?: (IRecipient|null);

        /** Transfer amount. */
        public amount: Long;

        /**
         * Creates a new Transfer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Transfer instance
         */
        public static create(properties?: MassTransferTransactionData.ITransfer): MassTransferTransactionData.Transfer;

        /**
         * Encodes the specified Transfer message. Does not implicitly {@link MassTransferTransactionData.Transfer.verify|verify} messages.
         * @param message Transfer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: MassTransferTransactionData.ITransfer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Transfer message, length delimited. Does not implicitly {@link MassTransferTransactionData.Transfer.verify|verify} messages.
         * @param message Transfer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: MassTransferTransactionData.ITransfer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Transfer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Transfer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MassTransferTransactionData.Transfer;

        /**
         * Decodes a Transfer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Transfer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MassTransferTransactionData.Transfer;

        /**
         * Verifies a Transfer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Transfer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Transfer
         */
        public static fromObject(object: { [k: string]: any }): MassTransferTransactionData.Transfer;

        /**
         * Creates a plain object from a Transfer message. Also converts values to other types if specified.
         * @param message Transfer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: MassTransferTransactionData.Transfer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Transfer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of a LeaseTransactionData. */
export interface ILeaseTransactionData {

    /** LeaseTransactionData recipient */
    recipient?: (IRecipient|null);

    /** LeaseTransactionData amount */
    amount?: (Long|null);
}

/** Represents a LeaseTransactionData. */
export class LeaseTransactionData implements ILeaseTransactionData {

    /**
     * Constructs a new LeaseTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: ILeaseTransactionData);

    /** LeaseTransactionData recipient. */
    public recipient?: (IRecipient|null);

    /** LeaseTransactionData amount. */
    public amount: Long;

    /**
     * Creates a new LeaseTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns LeaseTransactionData instance
     */
    public static create(properties?: ILeaseTransactionData): LeaseTransactionData;

    /**
     * Encodes the specified LeaseTransactionData message. Does not implicitly {@link LeaseTransactionData.verify|verify} messages.
     * @param message LeaseTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ILeaseTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified LeaseTransactionData message, length delimited. Does not implicitly {@link LeaseTransactionData.verify|verify} messages.
     * @param message LeaseTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ILeaseTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a LeaseTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns LeaseTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LeaseTransactionData;

    /**
     * Decodes a LeaseTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns LeaseTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LeaseTransactionData;

    /**
     * Verifies a LeaseTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a LeaseTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns LeaseTransactionData
     */
    public static fromObject(object: { [k: string]: any }): LeaseTransactionData;

    /**
     * Creates a plain object from a LeaseTransactionData message. Also converts values to other types if specified.
     * @param message LeaseTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: LeaseTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this LeaseTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a LeaseCancelTransactionData. */
export interface ILeaseCancelTransactionData {

    /** LeaseCancelTransactionData leaseId */
    leaseId?: (Uint8Array|null);
}

/** Represents a LeaseCancelTransactionData. */
export class LeaseCancelTransactionData implements ILeaseCancelTransactionData {

    /**
     * Constructs a new LeaseCancelTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: ILeaseCancelTransactionData);

    /** LeaseCancelTransactionData leaseId. */
    public leaseId: Uint8Array;

    /**
     * Creates a new LeaseCancelTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns LeaseCancelTransactionData instance
     */
    public static create(properties?: ILeaseCancelTransactionData): LeaseCancelTransactionData;

    /**
     * Encodes the specified LeaseCancelTransactionData message. Does not implicitly {@link LeaseCancelTransactionData.verify|verify} messages.
     * @param message LeaseCancelTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ILeaseCancelTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified LeaseCancelTransactionData message, length delimited. Does not implicitly {@link LeaseCancelTransactionData.verify|verify} messages.
     * @param message LeaseCancelTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ILeaseCancelTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a LeaseCancelTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns LeaseCancelTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LeaseCancelTransactionData;

    /**
     * Decodes a LeaseCancelTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns LeaseCancelTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LeaseCancelTransactionData;

    /**
     * Verifies a LeaseCancelTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a LeaseCancelTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns LeaseCancelTransactionData
     */
    public static fromObject(object: { [k: string]: any }): LeaseCancelTransactionData;

    /**
     * Creates a plain object from a LeaseCancelTransactionData message. Also converts values to other types if specified.
     * @param message LeaseCancelTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: LeaseCancelTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this LeaseCancelTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a BurnTransactionData. */
export interface IBurnTransactionData {

    /** BurnTransactionData assetAmount */
    assetAmount?: (IAssetAmount|null);
}

/** Represents a BurnTransactionData. */
export class BurnTransactionData implements IBurnTransactionData {

    /**
     * Constructs a new BurnTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IBurnTransactionData);

    /** BurnTransactionData assetAmount. */
    public assetAmount?: (IAssetAmount|null);

    /**
     * Creates a new BurnTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BurnTransactionData instance
     */
    public static create(properties?: IBurnTransactionData): BurnTransactionData;

    /**
     * Encodes the specified BurnTransactionData message. Does not implicitly {@link BurnTransactionData.verify|verify} messages.
     * @param message BurnTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IBurnTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified BurnTransactionData message, length delimited. Does not implicitly {@link BurnTransactionData.verify|verify} messages.
     * @param message BurnTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IBurnTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a BurnTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BurnTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): BurnTransactionData;

    /**
     * Decodes a BurnTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns BurnTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): BurnTransactionData;

    /**
     * Verifies a BurnTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a BurnTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns BurnTransactionData
     */
    public static fromObject(object: { [k: string]: any }): BurnTransactionData;

    /**
     * Creates a plain object from a BurnTransactionData message. Also converts values to other types if specified.
     * @param message BurnTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: BurnTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this BurnTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an IssueTransactionData. */
export interface IIssueTransactionData {

    /** IssueTransactionData name */
    name?: (Uint8Array|null);

    /** IssueTransactionData description */
    description?: (Uint8Array|null);

    /** IssueTransactionData amount */
    amount?: (Long|null);

    /** IssueTransactionData decimals */
    decimals?: (number|null);

    /** IssueTransactionData reissuable */
    reissuable?: (boolean|null);

    /** IssueTransactionData script */
    script?: (IScript|null);
}

/** Represents an IssueTransactionData. */
export class IssueTransactionData implements IIssueTransactionData {

    /**
     * Constructs a new IssueTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IIssueTransactionData);

    /** IssueTransactionData name. */
    public name: Uint8Array;

    /** IssueTransactionData description. */
    public description: Uint8Array;

    /** IssueTransactionData amount. */
    public amount: Long;

    /** IssueTransactionData decimals. */
    public decimals: number;

    /** IssueTransactionData reissuable. */
    public reissuable: boolean;

    /** IssueTransactionData script. */
    public script?: (IScript|null);

    /**
     * Creates a new IssueTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns IssueTransactionData instance
     */
    public static create(properties?: IIssueTransactionData): IssueTransactionData;

    /**
     * Encodes the specified IssueTransactionData message. Does not implicitly {@link IssueTransactionData.verify|verify} messages.
     * @param message IssueTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IIssueTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified IssueTransactionData message, length delimited. Does not implicitly {@link IssueTransactionData.verify|verify} messages.
     * @param message IssueTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IIssueTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an IssueTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns IssueTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): IssueTransactionData;

    /**
     * Decodes an IssueTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns IssueTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): IssueTransactionData;

    /**
     * Verifies an IssueTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an IssueTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns IssueTransactionData
     */
    public static fromObject(object: { [k: string]: any }): IssueTransactionData;

    /**
     * Creates a plain object from an IssueTransactionData message. Also converts values to other types if specified.
     * @param message IssueTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: IssueTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this IssueTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ReissueTransactionData. */
export interface IReissueTransactionData {

    /** ReissueTransactionData assetAmount */
    assetAmount?: (IAssetAmount|null);

    /** ReissueTransactionData reissuable */
    reissuable?: (boolean|null);
}

/** Represents a ReissueTransactionData. */
export class ReissueTransactionData implements IReissueTransactionData {

    /**
     * Constructs a new ReissueTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IReissueTransactionData);

    /** ReissueTransactionData assetAmount. */
    public assetAmount?: (IAssetAmount|null);

    /** ReissueTransactionData reissuable. */
    public reissuable: boolean;

    /**
     * Creates a new ReissueTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ReissueTransactionData instance
     */
    public static create(properties?: IReissueTransactionData): ReissueTransactionData;

    /**
     * Encodes the specified ReissueTransactionData message. Does not implicitly {@link ReissueTransactionData.verify|verify} messages.
     * @param message ReissueTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IReissueTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ReissueTransactionData message, length delimited. Does not implicitly {@link ReissueTransactionData.verify|verify} messages.
     * @param message ReissueTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IReissueTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ReissueTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ReissueTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ReissueTransactionData;

    /**
     * Decodes a ReissueTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ReissueTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ReissueTransactionData;

    /**
     * Verifies a ReissueTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ReissueTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ReissueTransactionData
     */
    public static fromObject(object: { [k: string]: any }): ReissueTransactionData;

    /**
     * Creates a plain object from a ReissueTransactionData message. Also converts values to other types if specified.
     * @param message ReissueTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ReissueTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ReissueTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SetAssetScriptTransactionData. */
export interface ISetAssetScriptTransactionData {

    /** SetAssetScriptTransactionData assetId */
    assetId?: (Uint8Array|null);

    /** SetAssetScriptTransactionData script */
    script?: (IScript|null);
}

/** Represents a SetAssetScriptTransactionData. */
export class SetAssetScriptTransactionData implements ISetAssetScriptTransactionData {

    /**
     * Constructs a new SetAssetScriptTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISetAssetScriptTransactionData);

    /** SetAssetScriptTransactionData assetId. */
    public assetId: Uint8Array;

    /** SetAssetScriptTransactionData script. */
    public script?: (IScript|null);

    /**
     * Creates a new SetAssetScriptTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SetAssetScriptTransactionData instance
     */
    public static create(properties?: ISetAssetScriptTransactionData): SetAssetScriptTransactionData;

    /**
     * Encodes the specified SetAssetScriptTransactionData message. Does not implicitly {@link SetAssetScriptTransactionData.verify|verify} messages.
     * @param message SetAssetScriptTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISetAssetScriptTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SetAssetScriptTransactionData message, length delimited. Does not implicitly {@link SetAssetScriptTransactionData.verify|verify} messages.
     * @param message SetAssetScriptTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISetAssetScriptTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SetAssetScriptTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SetAssetScriptTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SetAssetScriptTransactionData;

    /**
     * Decodes a SetAssetScriptTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SetAssetScriptTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SetAssetScriptTransactionData;

    /**
     * Verifies a SetAssetScriptTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SetAssetScriptTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SetAssetScriptTransactionData
     */
    public static fromObject(object: { [k: string]: any }): SetAssetScriptTransactionData;

    /**
     * Creates a plain object from a SetAssetScriptTransactionData message. Also converts values to other types if specified.
     * @param message SetAssetScriptTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SetAssetScriptTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SetAssetScriptTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SetScriptTransactionData. */
export interface ISetScriptTransactionData {

    /** SetScriptTransactionData script */
    script?: (IScript|null);
}

/** Represents a SetScriptTransactionData. */
export class SetScriptTransactionData implements ISetScriptTransactionData {

    /**
     * Constructs a new SetScriptTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISetScriptTransactionData);

    /** SetScriptTransactionData script. */
    public script?: (IScript|null);

    /**
     * Creates a new SetScriptTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SetScriptTransactionData instance
     */
    public static create(properties?: ISetScriptTransactionData): SetScriptTransactionData;

    /**
     * Encodes the specified SetScriptTransactionData message. Does not implicitly {@link SetScriptTransactionData.verify|verify} messages.
     * @param message SetScriptTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISetScriptTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SetScriptTransactionData message, length delimited. Does not implicitly {@link SetScriptTransactionData.verify|verify} messages.
     * @param message SetScriptTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISetScriptTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SetScriptTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SetScriptTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SetScriptTransactionData;

    /**
     * Decodes a SetScriptTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SetScriptTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SetScriptTransactionData;

    /**
     * Verifies a SetScriptTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SetScriptTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SetScriptTransactionData
     */
    public static fromObject(object: { [k: string]: any }): SetScriptTransactionData;

    /**
     * Creates a plain object from a SetScriptTransactionData message. Also converts values to other types if specified.
     * @param message SetScriptTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SetScriptTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SetScriptTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an ExchangeTransactionData. */
export interface IExchangeTransactionData {

    /** ExchangeTransactionData amount */
    amount?: (Long|null);

    /** ExchangeTransactionData price */
    price?: (Long|null);

    /** ExchangeTransactionData buyMatcherFee */
    buyMatcherFee?: (Long|null);

    /** ExchangeTransactionData sellMatcherFee */
    sellMatcherFee?: (Long|null);

    /** ExchangeTransactionData orders */
    orders?: (ExchangeTransactionData.IOrder[]|null);

    /** ExchangeTransactionData taker */
    taker?: (number|null);
}

/** Represents an ExchangeTransactionData. */
export class ExchangeTransactionData implements IExchangeTransactionData {

    /**
     * Constructs a new ExchangeTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IExchangeTransactionData);

    /** ExchangeTransactionData amount. */
    public amount: Long;

    /** ExchangeTransactionData price. */
    public price: Long;

    /** ExchangeTransactionData buyMatcherFee. */
    public buyMatcherFee: Long;

    /** ExchangeTransactionData sellMatcherFee. */
    public sellMatcherFee: Long;

    /** ExchangeTransactionData orders. */
    public orders: ExchangeTransactionData.IOrder[];

    /** ExchangeTransactionData taker. */
    public taker: number;

    /**
     * Creates a new ExchangeTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ExchangeTransactionData instance
     */
    public static create(properties?: IExchangeTransactionData): ExchangeTransactionData;

    /**
     * Encodes the specified ExchangeTransactionData message. Does not implicitly {@link ExchangeTransactionData.verify|verify} messages.
     * @param message ExchangeTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IExchangeTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ExchangeTransactionData message, length delimited. Does not implicitly {@link ExchangeTransactionData.verify|verify} messages.
     * @param message ExchangeTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IExchangeTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an ExchangeTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ExchangeTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ExchangeTransactionData;

    /**
     * Decodes an ExchangeTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ExchangeTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ExchangeTransactionData;

    /**
     * Verifies an ExchangeTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an ExchangeTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ExchangeTransactionData
     */
    public static fromObject(object: { [k: string]: any }): ExchangeTransactionData;

    /**
     * Creates a plain object from an ExchangeTransactionData message. Also converts values to other types if specified.
     * @param message ExchangeTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ExchangeTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ExchangeTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace ExchangeTransactionData {

    /** Properties of a BuySellOrders. */
    interface IBuySellOrders {

        /** BuySellOrders buyOrder */
        buyOrder?: (ExchangeTransactionData.IOrder|null);

        /** BuySellOrders sellOrder */
        sellOrder?: (ExchangeTransactionData.IOrder|null);
    }

    /** Represents a BuySellOrders. */
    class BuySellOrders implements IBuySellOrders {

        /**
         * Constructs a new BuySellOrders.
         * @param [properties] Properties to set
         */
        constructor(properties?: ExchangeTransactionData.IBuySellOrders);

        /** BuySellOrders buyOrder. */
        public buyOrder?: (ExchangeTransactionData.IOrder|null);

        /** BuySellOrders sellOrder. */
        public sellOrder?: (ExchangeTransactionData.IOrder|null);

        /**
         * Creates a new BuySellOrders instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BuySellOrders instance
         */
        public static create(properties?: ExchangeTransactionData.IBuySellOrders): ExchangeTransactionData.BuySellOrders;

        /**
         * Encodes the specified BuySellOrders message. Does not implicitly {@link ExchangeTransactionData.BuySellOrders.verify|verify} messages.
         * @param message BuySellOrders message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: ExchangeTransactionData.IBuySellOrders, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BuySellOrders message, length delimited. Does not implicitly {@link ExchangeTransactionData.BuySellOrders.verify|verify} messages.
         * @param message BuySellOrders message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: ExchangeTransactionData.IBuySellOrders, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BuySellOrders message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BuySellOrders
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ExchangeTransactionData.BuySellOrders;

        /**
         * Decodes a BuySellOrders message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BuySellOrders
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ExchangeTransactionData.BuySellOrders;

        /**
         * Verifies a BuySellOrders message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BuySellOrders message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BuySellOrders
         */
        public static fromObject(object: { [k: string]: any }): ExchangeTransactionData.BuySellOrders;

        /**
         * Creates a plain object from a BuySellOrders message. Also converts values to other types if specified.
         * @param message BuySellOrders
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: ExchangeTransactionData.BuySellOrders, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BuySellOrders to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MakerTakerOrders. */
    interface IMakerTakerOrders {

        /** MakerTakerOrders makerOrder */
        makerOrder?: (ExchangeTransactionData.IOrder|null);

        /** MakerTakerOrders takerOrder */
        takerOrder?: (ExchangeTransactionData.IOrder|null);
    }

    /** Represents a MakerTakerOrders. */
    class MakerTakerOrders implements IMakerTakerOrders {

        /**
         * Constructs a new MakerTakerOrders.
         * @param [properties] Properties to set
         */
        constructor(properties?: ExchangeTransactionData.IMakerTakerOrders);

        /** MakerTakerOrders makerOrder. */
        public makerOrder?: (ExchangeTransactionData.IOrder|null);

        /** MakerTakerOrders takerOrder. */
        public takerOrder?: (ExchangeTransactionData.IOrder|null);

        /**
         * Creates a new MakerTakerOrders instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MakerTakerOrders instance
         */
        public static create(properties?: ExchangeTransactionData.IMakerTakerOrders): ExchangeTransactionData.MakerTakerOrders;

        /**
         * Encodes the specified MakerTakerOrders message. Does not implicitly {@link ExchangeTransactionData.MakerTakerOrders.verify|verify} messages.
         * @param message MakerTakerOrders message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: ExchangeTransactionData.IMakerTakerOrders, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MakerTakerOrders message, length delimited. Does not implicitly {@link ExchangeTransactionData.MakerTakerOrders.verify|verify} messages.
         * @param message MakerTakerOrders message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: ExchangeTransactionData.IMakerTakerOrders, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MakerTakerOrders message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MakerTakerOrders
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ExchangeTransactionData.MakerTakerOrders;

        /**
         * Decodes a MakerTakerOrders message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MakerTakerOrders
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ExchangeTransactionData.MakerTakerOrders;

        /**
         * Verifies a MakerTakerOrders message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MakerTakerOrders message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MakerTakerOrders
         */
        public static fromObject(object: { [k: string]: any }): ExchangeTransactionData.MakerTakerOrders;

        /**
         * Creates a plain object from a MakerTakerOrders message. Also converts values to other types if specified.
         * @param message MakerTakerOrders
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: ExchangeTransactionData.MakerTakerOrders, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MakerTakerOrders to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Order. */
    interface IOrder {

        /** Order chainId */
        chainId?: (number|null);

        /** Order senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** Order matcherPublicKey */
        matcherPublicKey?: (Uint8Array|null);

        /** Order assetPair */
        assetPair?: (ExchangeTransactionData.Order.IAssetPair|null);

        /** Order orderSide */
        orderSide?: (ExchangeTransactionData.Order.Side|null);

        /** Order amount */
        amount?: (Long|null);

        /** Order price */
        price?: (Long|null);

        /** Order timestamp */
        timestamp?: (Long|null);

        /** Order expiration */
        expiration?: (Long|null);

        /** Order matcherFee */
        matcherFee?: (IAmount|null);

        /** Order version */
        version?: (number|null);

        /** Order proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents an Order. */
    class Order implements IOrder {

        /**
         * Constructs a new Order.
         * @param [properties] Properties to set
         */
        constructor(properties?: ExchangeTransactionData.IOrder);

        /** Order chainId. */
        public chainId: number;

        /** Order senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** Order matcherPublicKey. */
        public matcherPublicKey: Uint8Array;

        /** Order assetPair. */
        public assetPair?: (ExchangeTransactionData.Order.IAssetPair|null);

        /** Order orderSide. */
        public orderSide: ExchangeTransactionData.Order.Side;

        /** Order amount. */
        public amount: Long;

        /** Order price. */
        public price: Long;

        /** Order timestamp. */
        public timestamp: Long;

        /** Order expiration. */
        public expiration: Long;

        /** Order matcherFee. */
        public matcherFee?: (IAmount|null);

        /** Order version. */
        public version: number;

        /** Order proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new Order instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Order instance
         */
        public static create(properties?: ExchangeTransactionData.IOrder): ExchangeTransactionData.Order;

        /**
         * Encodes the specified Order message. Does not implicitly {@link ExchangeTransactionData.Order.verify|verify} messages.
         * @param message Order message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: ExchangeTransactionData.IOrder, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Order message, length delimited. Does not implicitly {@link ExchangeTransactionData.Order.verify|verify} messages.
         * @param message Order message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: ExchangeTransactionData.IOrder, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Order message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Order
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ExchangeTransactionData.Order;

        /**
         * Decodes an Order message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Order
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ExchangeTransactionData.Order;

        /**
         * Verifies an Order message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Order message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Order
         */
        public static fromObject(object: { [k: string]: any }): ExchangeTransactionData.Order;

        /**
         * Creates a plain object from an Order message. Also converts values to other types if specified.
         * @param message Order
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: ExchangeTransactionData.Order, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Order to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Order {

        /** Side enum. */
        enum Side {
            BUY = 0,
            SELL = 1
        }

        /** Properties of an AssetPair. */
        interface IAssetPair {

            /** AssetPair amountAssetId */
            amountAssetId?: (Uint8Array|null);

            /** AssetPair priceAssetId */
            priceAssetId?: (Uint8Array|null);
        }

        /** Represents an AssetPair. */
        class AssetPair implements IAssetPair {

            /**
             * Constructs a new AssetPair.
             * @param [properties] Properties to set
             */
            constructor(properties?: ExchangeTransactionData.Order.IAssetPair);

            /** AssetPair amountAssetId. */
            public amountAssetId: Uint8Array;

            /** AssetPair priceAssetId. */
            public priceAssetId: Uint8Array;

            /**
             * Creates a new AssetPair instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AssetPair instance
             */
            public static create(properties?: ExchangeTransactionData.Order.IAssetPair): ExchangeTransactionData.Order.AssetPair;

            /**
             * Encodes the specified AssetPair message. Does not implicitly {@link ExchangeTransactionData.Order.AssetPair.verify|verify} messages.
             * @param message AssetPair message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ExchangeTransactionData.Order.IAssetPair, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AssetPair message, length delimited. Does not implicitly {@link ExchangeTransactionData.Order.AssetPair.verify|verify} messages.
             * @param message AssetPair message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ExchangeTransactionData.Order.IAssetPair, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AssetPair message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AssetPair
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ExchangeTransactionData.Order.AssetPair;

            /**
             * Decodes an AssetPair message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AssetPair
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ExchangeTransactionData.Order.AssetPair;

            /**
             * Verifies an AssetPair message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AssetPair message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AssetPair
             */
            public static fromObject(object: { [k: string]: any }): ExchangeTransactionData.Order.AssetPair;

            /**
             * Creates a plain object from an AssetPair message. Also converts values to other types if specified.
             * @param message AssetPair
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: ExchangeTransactionData.Order.AssetPair, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AssetPair to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}

/** Properties of a SponsorFeeTransactionData. */
export interface ISponsorFeeTransactionData {

    /** SponsorFeeTransactionData minFee */
    minFee?: (IAssetAmount|null);
}

/** Represents a SponsorFeeTransactionData. */
export class SponsorFeeTransactionData implements ISponsorFeeTransactionData {

    /**
     * Constructs a new SponsorFeeTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISponsorFeeTransactionData);

    /** SponsorFeeTransactionData minFee. */
    public minFee?: (IAssetAmount|null);

    /**
     * Creates a new SponsorFeeTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SponsorFeeTransactionData instance
     */
    public static create(properties?: ISponsorFeeTransactionData): SponsorFeeTransactionData;

    /**
     * Encodes the specified SponsorFeeTransactionData message. Does not implicitly {@link SponsorFeeTransactionData.verify|verify} messages.
     * @param message SponsorFeeTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISponsorFeeTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SponsorFeeTransactionData message, length delimited. Does not implicitly {@link SponsorFeeTransactionData.verify|verify} messages.
     * @param message SponsorFeeTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISponsorFeeTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SponsorFeeTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SponsorFeeTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SponsorFeeTransactionData;

    /**
     * Decodes a SponsorFeeTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SponsorFeeTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SponsorFeeTransactionData;

    /**
     * Verifies a SponsorFeeTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SponsorFeeTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SponsorFeeTransactionData
     */
    public static fromObject(object: { [k: string]: any }): SponsorFeeTransactionData;

    /**
     * Creates a plain object from a SponsorFeeTransactionData message. Also converts values to other types if specified.
     * @param message SponsorFeeTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SponsorFeeTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SponsorFeeTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an InvokeScriptTransactionData. */
export interface IInvokeScriptTransactionData {

    /** InvokeScriptTransactionData dappAddress */
    dappAddress?: (Uint8Array|null);

    /** InvokeScriptTransactionData functionCall */
    functionCall?: (Uint8Array|null);

    /** InvokeScriptTransactionData payments */
    payments?: (IAmount[]|null);
}

/** Represents an InvokeScriptTransactionData. */
export class InvokeScriptTransactionData implements IInvokeScriptTransactionData {

    /**
     * Constructs a new InvokeScriptTransactionData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IInvokeScriptTransactionData);

    /** InvokeScriptTransactionData dappAddress. */
    public dappAddress: Uint8Array;

    /** InvokeScriptTransactionData functionCall. */
    public functionCall: Uint8Array;

    /** InvokeScriptTransactionData payments. */
    public payments: IAmount[];

    /**
     * Creates a new InvokeScriptTransactionData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns InvokeScriptTransactionData instance
     */
    public static create(properties?: IInvokeScriptTransactionData): InvokeScriptTransactionData;

    /**
     * Encodes the specified InvokeScriptTransactionData message. Does not implicitly {@link InvokeScriptTransactionData.verify|verify} messages.
     * @param message InvokeScriptTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IInvokeScriptTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified InvokeScriptTransactionData message, length delimited. Does not implicitly {@link InvokeScriptTransactionData.verify|verify} messages.
     * @param message InvokeScriptTransactionData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IInvokeScriptTransactionData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an InvokeScriptTransactionData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns InvokeScriptTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): InvokeScriptTransactionData;

    /**
     * Decodes an InvokeScriptTransactionData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns InvokeScriptTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): InvokeScriptTransactionData;

    /**
     * Verifies an InvokeScriptTransactionData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an InvokeScriptTransactionData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns InvokeScriptTransactionData
     */
    public static fromObject(object: { [k: string]: any }): InvokeScriptTransactionData;

    /**
     * Creates a plain object from an InvokeScriptTransactionData message. Also converts values to other types if specified.
     * @param message InvokeScriptTransactionData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: InvokeScriptTransactionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this InvokeScriptTransactionData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an InvokeScriptResult. */
export interface IInvokeScriptResult {

    /** InvokeScriptResult data */
    data?: (DataTransactionData.IDataEntry[]|null);

    /** InvokeScriptResult transfers */
    transfers?: (InvokeScriptResult.IPayment[]|null);
}

/** Represents an InvokeScriptResult. */
export class InvokeScriptResult implements IInvokeScriptResult {

    /**
     * Constructs a new InvokeScriptResult.
     * @param [properties] Properties to set
     */
    constructor(properties?: IInvokeScriptResult);

    /** InvokeScriptResult data. */
    public data: DataTransactionData.IDataEntry[];

    /** InvokeScriptResult transfers. */
    public transfers: InvokeScriptResult.IPayment[];

    /**
     * Creates a new InvokeScriptResult instance using the specified properties.
     * @param [properties] Properties to set
     * @returns InvokeScriptResult instance
     */
    public static create(properties?: IInvokeScriptResult): InvokeScriptResult;

    /**
     * Encodes the specified InvokeScriptResult message. Does not implicitly {@link InvokeScriptResult.verify|verify} messages.
     * @param message InvokeScriptResult message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IInvokeScriptResult, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified InvokeScriptResult message, length delimited. Does not implicitly {@link InvokeScriptResult.verify|verify} messages.
     * @param message InvokeScriptResult message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IInvokeScriptResult, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an InvokeScriptResult message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns InvokeScriptResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): InvokeScriptResult;

    /**
     * Decodes an InvokeScriptResult message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns InvokeScriptResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): InvokeScriptResult;

    /**
     * Verifies an InvokeScriptResult message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an InvokeScriptResult message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns InvokeScriptResult
     */
    public static fromObject(object: { [k: string]: any }): InvokeScriptResult;

    /**
     * Creates a plain object from an InvokeScriptResult message. Also converts values to other types if specified.
     * @param message InvokeScriptResult
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: InvokeScriptResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this InvokeScriptResult to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace InvokeScriptResult {

    /** Properties of a Payment. */
    interface IPayment {

        /** Payment address */
        address?: (Uint8Array|null);

        /** Payment amount */
        amount?: (IAmount|null);
    }

    /** Represents a Payment. */
    class Payment implements IPayment {

        /**
         * Constructs a new Payment.
         * @param [properties] Properties to set
         */
        constructor(properties?: InvokeScriptResult.IPayment);

        /** Payment address. */
        public address: Uint8Array;

        /** Payment amount. */
        public amount?: (IAmount|null);

        /**
         * Creates a new Payment instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Payment instance
         */
        public static create(properties?: InvokeScriptResult.IPayment): InvokeScriptResult.Payment;

        /**
         * Encodes the specified Payment message. Does not implicitly {@link InvokeScriptResult.Payment.verify|verify} messages.
         * @param message Payment message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: InvokeScriptResult.IPayment, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Payment message, length delimited. Does not implicitly {@link InvokeScriptResult.Payment.verify|verify} messages.
         * @param message Payment message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: InvokeScriptResult.IPayment, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Payment message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Payment
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): InvokeScriptResult.Payment;

        /**
         * Decodes a Payment message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Payment
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): InvokeScriptResult.Payment;

        /**
         * Verifies a Payment message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Payment message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Payment
         */
        public static fromObject(object: { [k: string]: any }): InvokeScriptResult.Payment;

        /**
         * Creates a plain object from a Payment message. Also converts values to other types if specified.
         * @param message Payment
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: InvokeScriptResult.Payment, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Payment to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of a Script. */
export interface IScript {

    /** Script bytes */
    bytes?: (Uint8Array|null);
}

/** Represents a Script. */
export class Script implements IScript {

    /**
     * Constructs a new Script.
     * @param [properties] Properties to set
     */
    constructor(properties?: IScript);

    /** Script bytes. */
    public bytes: Uint8Array;

    /**
     * Creates a new Script instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Script instance
     */
    public static create(properties?: IScript): Script;

    /**
     * Encodes the specified Script message. Does not implicitly {@link Script.verify|verify} messages.
     * @param message Script message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IScript, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Script message, length delimited. Does not implicitly {@link Script.verify|verify} messages.
     * @param message Script message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IScript, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Script message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Script
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Script;

    /**
     * Decodes a Script message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Script
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Script;

    /**
     * Verifies a Script message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Script message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Script
     */
    public static fromObject(object: { [k: string]: any }): Script;

    /**
     * Creates a plain object from a Script message. Also converts values to other types if specified.
     * @param message Script
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Script, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Script to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Recipient. */
export interface IRecipient {

    /** Recipient address */
    address?: (Uint8Array|null);

    /** Recipient alias */
    alias?: (string|null);
}

/** Represents a Recipient. */
export class Recipient implements IRecipient {

    /**
     * Constructs a new Recipient.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRecipient);

    /** Recipient address. */
    public address: Uint8Array;

    /** Recipient alias. */
    public alias: string;

    /** Recipient recipient. */
    public recipient?: ("address"|"alias");

    /**
     * Creates a new Recipient instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Recipient instance
     */
    public static create(properties?: IRecipient): Recipient;

    /**
     * Encodes the specified Recipient message. Does not implicitly {@link Recipient.verify|verify} messages.
     * @param message Recipient message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRecipient, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Recipient message, length delimited. Does not implicitly {@link Recipient.verify|verify} messages.
     * @param message Recipient message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IRecipient, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Recipient message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Recipient
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Recipient;

    /**
     * Decodes a Recipient message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Recipient
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Recipient;

    /**
     * Verifies a Recipient message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Recipient message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Recipient
     */
    public static fromObject(object: { [k: string]: any }): Recipient;

    /**
     * Creates a plain object from a Recipient message. Also converts values to other types if specified.
     * @param message Recipient
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Recipient, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Recipient to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of an Empty. */
        interface IEmpty {
        }

        /** Represents an Empty. */
        class Empty implements IEmpty {

            /**
             * Constructs a new Empty.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEmpty);

            /**
             * Creates a new Empty instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Empty instance
             */
            public static create(properties?: google.protobuf.IEmpty): google.protobuf.Empty;

            /**
             * Encodes the specified Empty message. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @param message Empty message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Empty message, length delimited. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @param message Empty message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Empty message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Empty;

            /**
             * Decodes an Empty message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Empty;

            /**
             * Verifies an Empty message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Empty message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Empty
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Empty;

            /**
             * Creates a plain object from an Empty message. Also converts values to other types if specified.
             * @param message Empty
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Empty, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Empty to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
