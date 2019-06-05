/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.DataEntriesByTransactionRequest = (function() {

    /**
     * Properties of a DataEntriesByTransactionRequest.
     * @exports IDataEntriesByTransactionRequest
     * @interface IDataEntriesByTransactionRequest
     * @property {Uint8Array|null} [transactionId] DataEntriesByTransactionRequest transactionId
     */

    /**
     * Constructs a new DataEntriesByTransactionRequest.
     * @exports DataEntriesByTransactionRequest
     * @classdesc Represents a DataEntriesByTransactionRequest.
     * @implements IDataEntriesByTransactionRequest
     * @constructor
     * @param {IDataEntriesByTransactionRequest=} [properties] Properties to set
     */
    function DataEntriesByTransactionRequest(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * DataEntriesByTransactionRequest transactionId.
     * @member {Uint8Array} transactionId
     * @memberof DataEntriesByTransactionRequest
     * @instance
     */
    DataEntriesByTransactionRequest.prototype.transactionId = $util.newBuffer([]);

    /**
     * Creates a new DataEntriesByTransactionRequest instance using the specified properties.
     * @function create
     * @memberof DataEntriesByTransactionRequest
     * @static
     * @param {IDataEntriesByTransactionRequest=} [properties] Properties to set
     * @returns {DataEntriesByTransactionRequest} DataEntriesByTransactionRequest instance
     */
    DataEntriesByTransactionRequest.create = function create(properties) {
        return new DataEntriesByTransactionRequest(properties);
    };

    /**
     * Encodes the specified DataEntriesByTransactionRequest message. Does not implicitly {@link DataEntriesByTransactionRequest.verify|verify} messages.
     * @function encode
     * @memberof DataEntriesByTransactionRequest
     * @static
     * @param {IDataEntriesByTransactionRequest} message DataEntriesByTransactionRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DataEntriesByTransactionRequest.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.transactionId != null && message.hasOwnProperty("transactionId"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.transactionId);
        return writer;
    };

    /**
     * Encodes the specified DataEntriesByTransactionRequest message, length delimited. Does not implicitly {@link DataEntriesByTransactionRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof DataEntriesByTransactionRequest
     * @static
     * @param {IDataEntriesByTransactionRequest} message DataEntriesByTransactionRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DataEntriesByTransactionRequest.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DataEntriesByTransactionRequest message from the specified reader or buffer.
     * @function decode
     * @memberof DataEntriesByTransactionRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {DataEntriesByTransactionRequest} DataEntriesByTransactionRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DataEntriesByTransactionRequest.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DataEntriesByTransactionRequest();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.transactionId = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a DataEntriesByTransactionRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof DataEntriesByTransactionRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {DataEntriesByTransactionRequest} DataEntriesByTransactionRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DataEntriesByTransactionRequest.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DataEntriesByTransactionRequest message.
     * @function verify
     * @memberof DataEntriesByTransactionRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DataEntriesByTransactionRequest.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.transactionId != null && message.hasOwnProperty("transactionId"))
            if (!(message.transactionId && typeof message.transactionId.length === "number" || $util.isString(message.transactionId)))
                return "transactionId: buffer expected";
        return null;
    };

    /**
     * Creates a DataEntriesByTransactionRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DataEntriesByTransactionRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {DataEntriesByTransactionRequest} DataEntriesByTransactionRequest
     */
    DataEntriesByTransactionRequest.fromObject = function fromObject(object) {
        if (object instanceof $root.DataEntriesByTransactionRequest)
            return object;
        var message = new $root.DataEntriesByTransactionRequest();
        if (object.transactionId != null)
            if (typeof object.transactionId === "string")
                $util.base64.decode(object.transactionId, message.transactionId = $util.newBuffer($util.base64.length(object.transactionId)), 0);
            else if (object.transactionId.length)
                message.transactionId = object.transactionId;
        return message;
    };

    /**
     * Creates a plain object from a DataEntriesByTransactionRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DataEntriesByTransactionRequest
     * @static
     * @param {DataEntriesByTransactionRequest} message DataEntriesByTransactionRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DataEntriesByTransactionRequest.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            if (options.bytes === String)
                object.transactionId = "";
            else {
                object.transactionId = [];
                if (options.bytes !== Array)
                    object.transactionId = $util.newBuffer(object.transactionId);
            }
        if (message.transactionId != null && message.hasOwnProperty("transactionId"))
            object.transactionId = options.bytes === String ? $util.base64.encode(message.transactionId, 0, message.transactionId.length) : options.bytes === Array ? Array.prototype.slice.call(message.transactionId) : message.transactionId;
        return object;
    };

    /**
     * Converts this DataEntriesByTransactionRequest to JSON.
     * @function toJSON
     * @memberof DataEntriesByTransactionRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DataEntriesByTransactionRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return DataEntriesByTransactionRequest;
})();

$root.DataEntriesByAddressRequest = (function() {

    /**
     * Properties of a DataEntriesByAddressRequest.
     * @exports IDataEntriesByAddressRequest
     * @interface IDataEntriesByAddressRequest
     * @property {number|null} [height] DataEntriesByAddressRequest height
     * @property {Long|null} [timestamp] DataEntriesByAddressRequest timestamp
     * @property {Uint8Array|null} [address] DataEntriesByAddressRequest address
     * @property {number|null} [limit] DataEntriesByAddressRequest limit
     * @property {Uint8Array|null} [after] DataEntriesByAddressRequest after
     * @property {string|null} [key] DataEntriesByAddressRequest key
     * @property {number|null} [type] DataEntriesByAddressRequest type
     * @property {Long|null} [intValue] DataEntriesByAddressRequest intValue
     * @property {boolean|null} [boolValue] DataEntriesByAddressRequest boolValue
     * @property {Uint8Array|null} [binaryValue] DataEntriesByAddressRequest binaryValue
     * @property {string|null} [stringValue] DataEntriesByAddressRequest stringValue
     */

    /**
     * Constructs a new DataEntriesByAddressRequest.
     * @exports DataEntriesByAddressRequest
     * @classdesc Represents a DataEntriesByAddressRequest.
     * @implements IDataEntriesByAddressRequest
     * @constructor
     * @param {IDataEntriesByAddressRequest=} [properties] Properties to set
     */
    function DataEntriesByAddressRequest(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * DataEntriesByAddressRequest height.
     * @member {number} height
     * @memberof DataEntriesByAddressRequest
     * @instance
     */
    DataEntriesByAddressRequest.prototype.height = 0;

    /**
     * DataEntriesByAddressRequest timestamp.
     * @member {Long} timestamp
     * @memberof DataEntriesByAddressRequest
     * @instance
     */
    DataEntriesByAddressRequest.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * DataEntriesByAddressRequest address.
     * @member {Uint8Array} address
     * @memberof DataEntriesByAddressRequest
     * @instance
     */
    DataEntriesByAddressRequest.prototype.address = $util.newBuffer([]);

    /**
     * DataEntriesByAddressRequest limit.
     * @member {number} limit
     * @memberof DataEntriesByAddressRequest
     * @instance
     */
    DataEntriesByAddressRequest.prototype.limit = 0;

    /**
     * DataEntriesByAddressRequest after.
     * @member {Uint8Array} after
     * @memberof DataEntriesByAddressRequest
     * @instance
     */
    DataEntriesByAddressRequest.prototype.after = $util.newBuffer([]);

    /**
     * DataEntriesByAddressRequest key.
     * @member {string} key
     * @memberof DataEntriesByAddressRequest
     * @instance
     */
    DataEntriesByAddressRequest.prototype.key = "";

    /**
     * DataEntriesByAddressRequest type.
     * @member {number} type
     * @memberof DataEntriesByAddressRequest
     * @instance
     */
    DataEntriesByAddressRequest.prototype.type = 0;

    /**
     * DataEntriesByAddressRequest intValue.
     * @member {Long} intValue
     * @memberof DataEntriesByAddressRequest
     * @instance
     */
    DataEntriesByAddressRequest.prototype.intValue = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * DataEntriesByAddressRequest boolValue.
     * @member {boolean} boolValue
     * @memberof DataEntriesByAddressRequest
     * @instance
     */
    DataEntriesByAddressRequest.prototype.boolValue = false;

    /**
     * DataEntriesByAddressRequest binaryValue.
     * @member {Uint8Array} binaryValue
     * @memberof DataEntriesByAddressRequest
     * @instance
     */
    DataEntriesByAddressRequest.prototype.binaryValue = $util.newBuffer([]);

    /**
     * DataEntriesByAddressRequest stringValue.
     * @member {string} stringValue
     * @memberof DataEntriesByAddressRequest
     * @instance
     */
    DataEntriesByAddressRequest.prototype.stringValue = "";

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * DataEntriesByAddressRequest value.
     * @member {"intValue"|"boolValue"|"binaryValue"|"stringValue"|undefined} value
     * @memberof DataEntriesByAddressRequest
     * @instance
     */
    Object.defineProperty(DataEntriesByAddressRequest.prototype, "value", {
        get: $util.oneOfGetter($oneOfFields = ["intValue", "boolValue", "binaryValue", "stringValue"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new DataEntriesByAddressRequest instance using the specified properties.
     * @function create
     * @memberof DataEntriesByAddressRequest
     * @static
     * @param {IDataEntriesByAddressRequest=} [properties] Properties to set
     * @returns {DataEntriesByAddressRequest} DataEntriesByAddressRequest instance
     */
    DataEntriesByAddressRequest.create = function create(properties) {
        return new DataEntriesByAddressRequest(properties);
    };

    /**
     * Encodes the specified DataEntriesByAddressRequest message. Does not implicitly {@link DataEntriesByAddressRequest.verify|verify} messages.
     * @function encode
     * @memberof DataEntriesByAddressRequest
     * @static
     * @param {IDataEntriesByAddressRequest} message DataEntriesByAddressRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DataEntriesByAddressRequest.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.height != null && message.hasOwnProperty("height"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.height);
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestamp);
        if (message.address != null && message.hasOwnProperty("address"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.address);
        if (message.limit != null && message.hasOwnProperty("limit"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.limit);
        if (message.after != null && message.hasOwnProperty("after"))
            writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.after);
        if (message.key != null && message.hasOwnProperty("key"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.key);
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 7, wireType 0 =*/56).int32(message.type);
        if (message.intValue != null && message.hasOwnProperty("intValue"))
            writer.uint32(/* id 10, wireType 0 =*/80).int64(message.intValue);
        if (message.boolValue != null && message.hasOwnProperty("boolValue"))
            writer.uint32(/* id 11, wireType 0 =*/88).bool(message.boolValue);
        if (message.binaryValue != null && message.hasOwnProperty("binaryValue"))
            writer.uint32(/* id 12, wireType 2 =*/98).bytes(message.binaryValue);
        if (message.stringValue != null && message.hasOwnProperty("stringValue"))
            writer.uint32(/* id 13, wireType 2 =*/106).string(message.stringValue);
        return writer;
    };

    /**
     * Encodes the specified DataEntriesByAddressRequest message, length delimited. Does not implicitly {@link DataEntriesByAddressRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof DataEntriesByAddressRequest
     * @static
     * @param {IDataEntriesByAddressRequest} message DataEntriesByAddressRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DataEntriesByAddressRequest.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DataEntriesByAddressRequest message from the specified reader or buffer.
     * @function decode
     * @memberof DataEntriesByAddressRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {DataEntriesByAddressRequest} DataEntriesByAddressRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DataEntriesByAddressRequest.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DataEntriesByAddressRequest();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.height = reader.int32();
                break;
            case 2:
                message.timestamp = reader.int64();
                break;
            case 3:
                message.address = reader.bytes();
                break;
            case 4:
                message.limit = reader.int32();
                break;
            case 5:
                message.after = reader.bytes();
                break;
            case 6:
                message.key = reader.string();
                break;
            case 7:
                message.type = reader.int32();
                break;
            case 10:
                message.intValue = reader.int64();
                break;
            case 11:
                message.boolValue = reader.bool();
                break;
            case 12:
                message.binaryValue = reader.bytes();
                break;
            case 13:
                message.stringValue = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a DataEntriesByAddressRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof DataEntriesByAddressRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {DataEntriesByAddressRequest} DataEntriesByAddressRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DataEntriesByAddressRequest.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DataEntriesByAddressRequest message.
     * @function verify
     * @memberof DataEntriesByAddressRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DataEntriesByAddressRequest.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.height != null && message.hasOwnProperty("height"))
            if (!$util.isInteger(message.height))
                return "height: integer expected";
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                return "timestamp: integer|Long expected";
        if (message.address != null && message.hasOwnProperty("address"))
            if (!(message.address && typeof message.address.length === "number" || $util.isString(message.address)))
                return "address: buffer expected";
        if (message.limit != null && message.hasOwnProperty("limit"))
            if (!$util.isInteger(message.limit))
                return "limit: integer expected";
        if (message.after != null && message.hasOwnProperty("after"))
            if (!(message.after && typeof message.after.length === "number" || $util.isString(message.after)))
                return "after: buffer expected";
        if (message.key != null && message.hasOwnProperty("key"))
            if (!$util.isString(message.key))
                return "key: string expected";
        if (message.type != null && message.hasOwnProperty("type"))
            if (!$util.isInteger(message.type))
                return "type: integer expected";
        if (message.intValue != null && message.hasOwnProperty("intValue")) {
            properties.value = 1;
            if (!$util.isInteger(message.intValue) && !(message.intValue && $util.isInteger(message.intValue.low) && $util.isInteger(message.intValue.high)))
                return "intValue: integer|Long expected";
        }
        if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
            if (properties.value === 1)
                return "value: multiple values";
            properties.value = 1;
            if (typeof message.boolValue !== "boolean")
                return "boolValue: boolean expected";
        }
        if (message.binaryValue != null && message.hasOwnProperty("binaryValue")) {
            if (properties.value === 1)
                return "value: multiple values";
            properties.value = 1;
            if (!(message.binaryValue && typeof message.binaryValue.length === "number" || $util.isString(message.binaryValue)))
                return "binaryValue: buffer expected";
        }
        if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
            if (properties.value === 1)
                return "value: multiple values";
            properties.value = 1;
            if (!$util.isString(message.stringValue))
                return "stringValue: string expected";
        }
        return null;
    };

    /**
     * Creates a DataEntriesByAddressRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DataEntriesByAddressRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {DataEntriesByAddressRequest} DataEntriesByAddressRequest
     */
    DataEntriesByAddressRequest.fromObject = function fromObject(object) {
        if (object instanceof $root.DataEntriesByAddressRequest)
            return object;
        var message = new $root.DataEntriesByAddressRequest();
        if (object.height != null)
            message.height = object.height | 0;
        if (object.timestamp != null)
            if ($util.Long)
                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
            else if (typeof object.timestamp === "string")
                message.timestamp = parseInt(object.timestamp, 10);
            else if (typeof object.timestamp === "number")
                message.timestamp = object.timestamp;
            else if (typeof object.timestamp === "object")
                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
        if (object.address != null)
            if (typeof object.address === "string")
                $util.base64.decode(object.address, message.address = $util.newBuffer($util.base64.length(object.address)), 0);
            else if (object.address.length)
                message.address = object.address;
        if (object.limit != null)
            message.limit = object.limit | 0;
        if (object.after != null)
            if (typeof object.after === "string")
                $util.base64.decode(object.after, message.after = $util.newBuffer($util.base64.length(object.after)), 0);
            else if (object.after.length)
                message.after = object.after;
        if (object.key != null)
            message.key = String(object.key);
        if (object.type != null)
            message.type = object.type | 0;
        if (object.intValue != null)
            if ($util.Long)
                (message.intValue = $util.Long.fromValue(object.intValue)).unsigned = false;
            else if (typeof object.intValue === "string")
                message.intValue = parseInt(object.intValue, 10);
            else if (typeof object.intValue === "number")
                message.intValue = object.intValue;
            else if (typeof object.intValue === "object")
                message.intValue = new $util.LongBits(object.intValue.low >>> 0, object.intValue.high >>> 0).toNumber();
        if (object.boolValue != null)
            message.boolValue = Boolean(object.boolValue);
        if (object.binaryValue != null)
            if (typeof object.binaryValue === "string")
                $util.base64.decode(object.binaryValue, message.binaryValue = $util.newBuffer($util.base64.length(object.binaryValue)), 0);
            else if (object.binaryValue.length)
                message.binaryValue = object.binaryValue;
        if (object.stringValue != null)
            message.stringValue = String(object.stringValue);
        return message;
    };

    /**
     * Creates a plain object from a DataEntriesByAddressRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DataEntriesByAddressRequest
     * @static
     * @param {DataEntriesByAddressRequest} message DataEntriesByAddressRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DataEntriesByAddressRequest.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.height = 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.timestamp = options.longs === String ? "0" : 0;
            if (options.bytes === String)
                object.address = "";
            else {
                object.address = [];
                if (options.bytes !== Array)
                    object.address = $util.newBuffer(object.address);
            }
            object.limit = 0;
            if (options.bytes === String)
                object.after = "";
            else {
                object.after = [];
                if (options.bytes !== Array)
                    object.after = $util.newBuffer(object.after);
            }
            object.key = "";
            object.type = 0;
        }
        if (message.height != null && message.hasOwnProperty("height"))
            object.height = message.height;
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (typeof message.timestamp === "number")
                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
            else
                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
        if (message.address != null && message.hasOwnProperty("address"))
            object.address = options.bytes === String ? $util.base64.encode(message.address, 0, message.address.length) : options.bytes === Array ? Array.prototype.slice.call(message.address) : message.address;
        if (message.limit != null && message.hasOwnProperty("limit"))
            object.limit = message.limit;
        if (message.after != null && message.hasOwnProperty("after"))
            object.after = options.bytes === String ? $util.base64.encode(message.after, 0, message.after.length) : options.bytes === Array ? Array.prototype.slice.call(message.after) : message.after;
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = message.key;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = message.type;
        if (message.intValue != null && message.hasOwnProperty("intValue")) {
            if (typeof message.intValue === "number")
                object.intValue = options.longs === String ? String(message.intValue) : message.intValue;
            else
                object.intValue = options.longs === String ? $util.Long.prototype.toString.call(message.intValue) : options.longs === Number ? new $util.LongBits(message.intValue.low >>> 0, message.intValue.high >>> 0).toNumber() : message.intValue;
            if (options.oneofs)
                object.value = "intValue";
        }
        if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
            object.boolValue = message.boolValue;
            if (options.oneofs)
                object.value = "boolValue";
        }
        if (message.binaryValue != null && message.hasOwnProperty("binaryValue")) {
            object.binaryValue = options.bytes === String ? $util.base64.encode(message.binaryValue, 0, message.binaryValue.length) : options.bytes === Array ? Array.prototype.slice.call(message.binaryValue) : message.binaryValue;
            if (options.oneofs)
                object.value = "binaryValue";
        }
        if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
            object.stringValue = message.stringValue;
            if (options.oneofs)
                object.value = "stringValue";
        }
        return object;
    };

    /**
     * Converts this DataEntriesByAddressRequest to JSON.
     * @function toJSON
     * @memberof DataEntriesByAddressRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DataEntriesByAddressRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return DataEntriesByAddressRequest;
})();

$root.DataEntriesSearchRequest = (function() {

    /**
     * Properties of a DataEntriesSearchRequest.
     * @exports IDataEntriesSearchRequest
     * @interface IDataEntriesSearchRequest
     * @property {number|null} [height] DataEntriesSearchRequest height
     * @property {Long|null} [timestamp] DataEntriesSearchRequest timestamp
     * @property {number|null} [limit] DataEntriesSearchRequest limit
     * @property {Uint8Array|null} [after] DataEntriesSearchRequest after
     * @property {string|null} [key] DataEntriesSearchRequest key
     * @property {number|null} [type] DataEntriesSearchRequest type
     * @property {Long|null} [intValue] DataEntriesSearchRequest intValue
     * @property {boolean|null} [boolValue] DataEntriesSearchRequest boolValue
     * @property {Uint8Array|null} [binaryValue] DataEntriesSearchRequest binaryValue
     * @property {string|null} [stringValue] DataEntriesSearchRequest stringValue
     */

    /**
     * Constructs a new DataEntriesSearchRequest.
     * @exports DataEntriesSearchRequest
     * @classdesc Represents a DataEntriesSearchRequest.
     * @implements IDataEntriesSearchRequest
     * @constructor
     * @param {IDataEntriesSearchRequest=} [properties] Properties to set
     */
    function DataEntriesSearchRequest(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * DataEntriesSearchRequest height.
     * @member {number} height
     * @memberof DataEntriesSearchRequest
     * @instance
     */
    DataEntriesSearchRequest.prototype.height = 0;

    /**
     * DataEntriesSearchRequest timestamp.
     * @member {Long} timestamp
     * @memberof DataEntriesSearchRequest
     * @instance
     */
    DataEntriesSearchRequest.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * DataEntriesSearchRequest limit.
     * @member {number} limit
     * @memberof DataEntriesSearchRequest
     * @instance
     */
    DataEntriesSearchRequest.prototype.limit = 0;

    /**
     * DataEntriesSearchRequest after.
     * @member {Uint8Array} after
     * @memberof DataEntriesSearchRequest
     * @instance
     */
    DataEntriesSearchRequest.prototype.after = $util.newBuffer([]);

    /**
     * DataEntriesSearchRequest key.
     * @member {string} key
     * @memberof DataEntriesSearchRequest
     * @instance
     */
    DataEntriesSearchRequest.prototype.key = "";

    /**
     * DataEntriesSearchRequest type.
     * @member {number} type
     * @memberof DataEntriesSearchRequest
     * @instance
     */
    DataEntriesSearchRequest.prototype.type = 0;

    /**
     * DataEntriesSearchRequest intValue.
     * @member {Long} intValue
     * @memberof DataEntriesSearchRequest
     * @instance
     */
    DataEntriesSearchRequest.prototype.intValue = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * DataEntriesSearchRequest boolValue.
     * @member {boolean} boolValue
     * @memberof DataEntriesSearchRequest
     * @instance
     */
    DataEntriesSearchRequest.prototype.boolValue = false;

    /**
     * DataEntriesSearchRequest binaryValue.
     * @member {Uint8Array} binaryValue
     * @memberof DataEntriesSearchRequest
     * @instance
     */
    DataEntriesSearchRequest.prototype.binaryValue = $util.newBuffer([]);

    /**
     * DataEntriesSearchRequest stringValue.
     * @member {string} stringValue
     * @memberof DataEntriesSearchRequest
     * @instance
     */
    DataEntriesSearchRequest.prototype.stringValue = "";

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * DataEntriesSearchRequest value.
     * @member {"intValue"|"boolValue"|"binaryValue"|"stringValue"|undefined} value
     * @memberof DataEntriesSearchRequest
     * @instance
     */
    Object.defineProperty(DataEntriesSearchRequest.prototype, "value", {
        get: $util.oneOfGetter($oneOfFields = ["intValue", "boolValue", "binaryValue", "stringValue"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new DataEntriesSearchRequest instance using the specified properties.
     * @function create
     * @memberof DataEntriesSearchRequest
     * @static
     * @param {IDataEntriesSearchRequest=} [properties] Properties to set
     * @returns {DataEntriesSearchRequest} DataEntriesSearchRequest instance
     */
    DataEntriesSearchRequest.create = function create(properties) {
        return new DataEntriesSearchRequest(properties);
    };

    /**
     * Encodes the specified DataEntriesSearchRequest message. Does not implicitly {@link DataEntriesSearchRequest.verify|verify} messages.
     * @function encode
     * @memberof DataEntriesSearchRequest
     * @static
     * @param {IDataEntriesSearchRequest} message DataEntriesSearchRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DataEntriesSearchRequest.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.height != null && message.hasOwnProperty("height"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.height);
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestamp);
        if (message.limit != null && message.hasOwnProperty("limit"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.limit);
        if (message.after != null && message.hasOwnProperty("after"))
            writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.after);
        if (message.key != null && message.hasOwnProperty("key"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.key);
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.type);
        if (message.intValue != null && message.hasOwnProperty("intValue"))
            writer.uint32(/* id 10, wireType 0 =*/80).int64(message.intValue);
        if (message.boolValue != null && message.hasOwnProperty("boolValue"))
            writer.uint32(/* id 11, wireType 0 =*/88).bool(message.boolValue);
        if (message.binaryValue != null && message.hasOwnProperty("binaryValue"))
            writer.uint32(/* id 12, wireType 2 =*/98).bytes(message.binaryValue);
        if (message.stringValue != null && message.hasOwnProperty("stringValue"))
            writer.uint32(/* id 13, wireType 2 =*/106).string(message.stringValue);
        return writer;
    };

    /**
     * Encodes the specified DataEntriesSearchRequest message, length delimited. Does not implicitly {@link DataEntriesSearchRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof DataEntriesSearchRequest
     * @static
     * @param {IDataEntriesSearchRequest} message DataEntriesSearchRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DataEntriesSearchRequest.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DataEntriesSearchRequest message from the specified reader or buffer.
     * @function decode
     * @memberof DataEntriesSearchRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {DataEntriesSearchRequest} DataEntriesSearchRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DataEntriesSearchRequest.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DataEntriesSearchRequest();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.height = reader.int32();
                break;
            case 2:
                message.timestamp = reader.int64();
                break;
            case 3:
                message.limit = reader.int32();
                break;
            case 4:
                message.after = reader.bytes();
                break;
            case 5:
                message.key = reader.string();
                break;
            case 6:
                message.type = reader.int32();
                break;
            case 10:
                message.intValue = reader.int64();
                break;
            case 11:
                message.boolValue = reader.bool();
                break;
            case 12:
                message.binaryValue = reader.bytes();
                break;
            case 13:
                message.stringValue = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a DataEntriesSearchRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof DataEntriesSearchRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {DataEntriesSearchRequest} DataEntriesSearchRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DataEntriesSearchRequest.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DataEntriesSearchRequest message.
     * @function verify
     * @memberof DataEntriesSearchRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DataEntriesSearchRequest.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.height != null && message.hasOwnProperty("height"))
            if (!$util.isInteger(message.height))
                return "height: integer expected";
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                return "timestamp: integer|Long expected";
        if (message.limit != null && message.hasOwnProperty("limit"))
            if (!$util.isInteger(message.limit))
                return "limit: integer expected";
        if (message.after != null && message.hasOwnProperty("after"))
            if (!(message.after && typeof message.after.length === "number" || $util.isString(message.after)))
                return "after: buffer expected";
        if (message.key != null && message.hasOwnProperty("key"))
            if (!$util.isString(message.key))
                return "key: string expected";
        if (message.type != null && message.hasOwnProperty("type"))
            if (!$util.isInteger(message.type))
                return "type: integer expected";
        if (message.intValue != null && message.hasOwnProperty("intValue")) {
            properties.value = 1;
            if (!$util.isInteger(message.intValue) && !(message.intValue && $util.isInteger(message.intValue.low) && $util.isInteger(message.intValue.high)))
                return "intValue: integer|Long expected";
        }
        if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
            if (properties.value === 1)
                return "value: multiple values";
            properties.value = 1;
            if (typeof message.boolValue !== "boolean")
                return "boolValue: boolean expected";
        }
        if (message.binaryValue != null && message.hasOwnProperty("binaryValue")) {
            if (properties.value === 1)
                return "value: multiple values";
            properties.value = 1;
            if (!(message.binaryValue && typeof message.binaryValue.length === "number" || $util.isString(message.binaryValue)))
                return "binaryValue: buffer expected";
        }
        if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
            if (properties.value === 1)
                return "value: multiple values";
            properties.value = 1;
            if (!$util.isString(message.stringValue))
                return "stringValue: string expected";
        }
        return null;
    };

    /**
     * Creates a DataEntriesSearchRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DataEntriesSearchRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {DataEntriesSearchRequest} DataEntriesSearchRequest
     */
    DataEntriesSearchRequest.fromObject = function fromObject(object) {
        if (object instanceof $root.DataEntriesSearchRequest)
            return object;
        var message = new $root.DataEntriesSearchRequest();
        if (object.height != null)
            message.height = object.height | 0;
        if (object.timestamp != null)
            if ($util.Long)
                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
            else if (typeof object.timestamp === "string")
                message.timestamp = parseInt(object.timestamp, 10);
            else if (typeof object.timestamp === "number")
                message.timestamp = object.timestamp;
            else if (typeof object.timestamp === "object")
                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
        if (object.limit != null)
            message.limit = object.limit | 0;
        if (object.after != null)
            if (typeof object.after === "string")
                $util.base64.decode(object.after, message.after = $util.newBuffer($util.base64.length(object.after)), 0);
            else if (object.after.length)
                message.after = object.after;
        if (object.key != null)
            message.key = String(object.key);
        if (object.type != null)
            message.type = object.type | 0;
        if (object.intValue != null)
            if ($util.Long)
                (message.intValue = $util.Long.fromValue(object.intValue)).unsigned = false;
            else if (typeof object.intValue === "string")
                message.intValue = parseInt(object.intValue, 10);
            else if (typeof object.intValue === "number")
                message.intValue = object.intValue;
            else if (typeof object.intValue === "object")
                message.intValue = new $util.LongBits(object.intValue.low >>> 0, object.intValue.high >>> 0).toNumber();
        if (object.boolValue != null)
            message.boolValue = Boolean(object.boolValue);
        if (object.binaryValue != null)
            if (typeof object.binaryValue === "string")
                $util.base64.decode(object.binaryValue, message.binaryValue = $util.newBuffer($util.base64.length(object.binaryValue)), 0);
            else if (object.binaryValue.length)
                message.binaryValue = object.binaryValue;
        if (object.stringValue != null)
            message.stringValue = String(object.stringValue);
        return message;
    };

    /**
     * Creates a plain object from a DataEntriesSearchRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DataEntriesSearchRequest
     * @static
     * @param {DataEntriesSearchRequest} message DataEntriesSearchRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DataEntriesSearchRequest.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.height = 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.timestamp = options.longs === String ? "0" : 0;
            object.limit = 0;
            if (options.bytes === String)
                object.after = "";
            else {
                object.after = [];
                if (options.bytes !== Array)
                    object.after = $util.newBuffer(object.after);
            }
            object.key = "";
            object.type = 0;
        }
        if (message.height != null && message.hasOwnProperty("height"))
            object.height = message.height;
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (typeof message.timestamp === "number")
                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
            else
                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
        if (message.limit != null && message.hasOwnProperty("limit"))
            object.limit = message.limit;
        if (message.after != null && message.hasOwnProperty("after"))
            object.after = options.bytes === String ? $util.base64.encode(message.after, 0, message.after.length) : options.bytes === Array ? Array.prototype.slice.call(message.after) : message.after;
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = message.key;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = message.type;
        if (message.intValue != null && message.hasOwnProperty("intValue")) {
            if (typeof message.intValue === "number")
                object.intValue = options.longs === String ? String(message.intValue) : message.intValue;
            else
                object.intValue = options.longs === String ? $util.Long.prototype.toString.call(message.intValue) : options.longs === Number ? new $util.LongBits(message.intValue.low >>> 0, message.intValue.high >>> 0).toNumber() : message.intValue;
            if (options.oneofs)
                object.value = "intValue";
        }
        if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
            object.boolValue = message.boolValue;
            if (options.oneofs)
                object.value = "boolValue";
        }
        if (message.binaryValue != null && message.hasOwnProperty("binaryValue")) {
            object.binaryValue = options.bytes === String ? $util.base64.encode(message.binaryValue, 0, message.binaryValue.length) : options.bytes === Array ? Array.prototype.slice.call(message.binaryValue) : message.binaryValue;
            if (options.oneofs)
                object.value = "binaryValue";
        }
        if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
            object.stringValue = message.stringValue;
            if (options.oneofs)
                object.value = "stringValue";
        }
        return object;
    };

    /**
     * Converts this DataEntriesSearchRequest to JSON.
     * @function toJSON
     * @memberof DataEntriesSearchRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DataEntriesSearchRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return DataEntriesSearchRequest;
})();

$root.DataEntryResponse = (function() {

    /**
     * Properties of a DataEntryResponse.
     * @exports IDataEntryResponse
     * @interface IDataEntryResponse
     * @property {Uint8Array|null} [address] DataEntryResponse address
     * @property {DataTransactionData.IDataEntry|null} [entry] DataEntryResponse entry
     */

    /**
     * Constructs a new DataEntryResponse.
     * @exports DataEntryResponse
     * @classdesc Represents a DataEntryResponse.
     * @implements IDataEntryResponse
     * @constructor
     * @param {IDataEntryResponse=} [properties] Properties to set
     */
    function DataEntryResponse(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * DataEntryResponse address.
     * @member {Uint8Array} address
     * @memberof DataEntryResponse
     * @instance
     */
    DataEntryResponse.prototype.address = $util.newBuffer([]);

    /**
     * DataEntryResponse entry.
     * @member {DataTransactionData.IDataEntry|null|undefined} entry
     * @memberof DataEntryResponse
     * @instance
     */
    DataEntryResponse.prototype.entry = null;

    /**
     * Creates a new DataEntryResponse instance using the specified properties.
     * @function create
     * @memberof DataEntryResponse
     * @static
     * @param {IDataEntryResponse=} [properties] Properties to set
     * @returns {DataEntryResponse} DataEntryResponse instance
     */
    DataEntryResponse.create = function create(properties) {
        return new DataEntryResponse(properties);
    };

    /**
     * Encodes the specified DataEntryResponse message. Does not implicitly {@link DataEntryResponse.verify|verify} messages.
     * @function encode
     * @memberof DataEntryResponse
     * @static
     * @param {IDataEntryResponse} message DataEntryResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DataEntryResponse.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.address != null && message.hasOwnProperty("address"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.address);
        if (message.entry != null && message.hasOwnProperty("entry"))
            $root.DataTransactionData.DataEntry.encode(message.entry, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified DataEntryResponse message, length delimited. Does not implicitly {@link DataEntryResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof DataEntryResponse
     * @static
     * @param {IDataEntryResponse} message DataEntryResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DataEntryResponse.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DataEntryResponse message from the specified reader or buffer.
     * @function decode
     * @memberof DataEntryResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {DataEntryResponse} DataEntryResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DataEntryResponse.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DataEntryResponse();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.address = reader.bytes();
                break;
            case 2:
                message.entry = $root.DataTransactionData.DataEntry.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a DataEntryResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof DataEntryResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {DataEntryResponse} DataEntryResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DataEntryResponse.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DataEntryResponse message.
     * @function verify
     * @memberof DataEntryResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DataEntryResponse.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.address != null && message.hasOwnProperty("address"))
            if (!(message.address && typeof message.address.length === "number" || $util.isString(message.address)))
                return "address: buffer expected";
        if (message.entry != null && message.hasOwnProperty("entry")) {
            var error = $root.DataTransactionData.DataEntry.verify(message.entry);
            if (error)
                return "entry." + error;
        }
        return null;
    };

    /**
     * Creates a DataEntryResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DataEntryResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {DataEntryResponse} DataEntryResponse
     */
    DataEntryResponse.fromObject = function fromObject(object) {
        if (object instanceof $root.DataEntryResponse)
            return object;
        var message = new $root.DataEntryResponse();
        if (object.address != null)
            if (typeof object.address === "string")
                $util.base64.decode(object.address, message.address = $util.newBuffer($util.base64.length(object.address)), 0);
            else if (object.address.length)
                message.address = object.address;
        if (object.entry != null) {
            if (typeof object.entry !== "object")
                throw TypeError(".DataEntryResponse.entry: object expected");
            message.entry = $root.DataTransactionData.DataEntry.fromObject(object.entry);
        }
        return message;
    };

    /**
     * Creates a plain object from a DataEntryResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DataEntryResponse
     * @static
     * @param {DataEntryResponse} message DataEntryResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DataEntryResponse.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.address = "";
            else {
                object.address = [];
                if (options.bytes !== Array)
                    object.address = $util.newBuffer(object.address);
            }
            object.entry = null;
        }
        if (message.address != null && message.hasOwnProperty("address"))
            object.address = options.bytes === String ? $util.base64.encode(message.address, 0, message.address.length) : options.bytes === Array ? Array.prototype.slice.call(message.address) : message.address;
        if (message.entry != null && message.hasOwnProperty("entry"))
            object.entry = $root.DataTransactionData.DataEntry.toObject(message.entry, options);
        return object;
    };

    /**
     * Converts this DataEntryResponse to JSON.
     * @function toJSON
     * @memberof DataEntryResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DataEntryResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return DataEntryResponse;
})();

$root.DataEntries = (function() {

    /**
     * Constructs a new DataEntries service.
     * @exports DataEntries
     * @classdesc Represents a DataEntries
     * @extends $protobuf.rpc.Service
     * @constructor
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     */
    function DataEntries(rpcImpl, requestDelimited, responseDelimited) {
        $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
    }

    (DataEntries.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = DataEntries;

    /**
     * Creates new DataEntries service using the specified rpc implementation.
     * @function create
     * @memberof DataEntries
     * @static
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     * @returns {DataEntries} RPC service. Useful where requests and/or responses are streamed.
     */
    DataEntries.create = function create(rpcImpl, requestDelimited, responseDelimited) {
        return new this(rpcImpl, requestDelimited, responseDelimited);
    };

    /**
     * Callback as used by {@link DataEntries#byTransaction}.
     * @memberof DataEntries
     * @typedef ByTransactionCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {DataEntryResponse} [response] DataEntryResponse
     */

    /**
     * Calls ByTransaction.
     * @function byTransaction
     * @memberof DataEntries
     * @instance
     * @param {IDataEntriesByTransactionRequest} request DataEntriesByTransactionRequest message or plain object
     * @param {DataEntries.ByTransactionCallback} callback Node-style callback called with the error, if any, and DataEntryResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(DataEntries.prototype.byTransaction = function byTransaction(request, callback) {
        return this.rpcCall(byTransaction, $root.DataEntriesByTransactionRequest, $root.DataEntryResponse, request, callback);
    }, "name", { value: "ByTransaction" });

    /**
     * Calls ByTransaction.
     * @function byTransaction
     * @memberof DataEntries
     * @instance
     * @param {IDataEntriesByTransactionRequest} request DataEntriesByTransactionRequest message or plain object
     * @returns {Promise<DataEntryResponse>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link DataEntries#byAddress}.
     * @memberof DataEntries
     * @typedef ByAddressCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {DataEntryResponse} [response] DataEntryResponse
     */

    /**
     * Calls ByAddress.
     * @function byAddress
     * @memberof DataEntries
     * @instance
     * @param {IDataEntriesByAddressRequest} request DataEntriesByAddressRequest message or plain object
     * @param {DataEntries.ByAddressCallback} callback Node-style callback called with the error, if any, and DataEntryResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(DataEntries.prototype.byAddress = function byAddress(request, callback) {
        return this.rpcCall(byAddress, $root.DataEntriesByAddressRequest, $root.DataEntryResponse, request, callback);
    }, "name", { value: "ByAddress" });

    /**
     * Calls ByAddress.
     * @function byAddress
     * @memberof DataEntries
     * @instance
     * @param {IDataEntriesByAddressRequest} request DataEntriesByAddressRequest message or plain object
     * @returns {Promise<DataEntryResponse>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link DataEntries#search}.
     * @memberof DataEntries
     * @typedef SearchCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {DataEntryResponse} [response] DataEntryResponse
     */

    /**
     * Calls Search.
     * @function search
     * @memberof DataEntries
     * @instance
     * @param {IDataEntriesSearchRequest} request DataEntriesSearchRequest message or plain object
     * @param {DataEntries.SearchCallback} callback Node-style callback called with the error, if any, and DataEntryResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(DataEntries.prototype.search = function search(request, callback) {
        return this.rpcCall(search, $root.DataEntriesSearchRequest, $root.DataEntryResponse, request, callback);
    }, "name", { value: "Search" });

    /**
     * Calls Search.
     * @function search
     * @memberof DataEntries
     * @instance
     * @param {IDataEntriesSearchRequest} request DataEntriesSearchRequest message or plain object
     * @returns {Promise<DataEntryResponse>} Promise
     * @variation 2
     */

    return DataEntries;
})();

$root.AssetId = (function() {

    /**
     * Properties of an AssetId.
     * @exports IAssetId
     * @interface IAssetId
     * @property {google.protobuf.IEmpty|null} [waves] AssetId waves
     * @property {Uint8Array|null} [issuedAsset] AssetId issuedAsset
     */

    /**
     * Constructs a new AssetId.
     * @exports AssetId
     * @classdesc Represents an AssetId.
     * @implements IAssetId
     * @constructor
     * @param {IAssetId=} [properties] Properties to set
     */
    function AssetId(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AssetId waves.
     * @member {google.protobuf.IEmpty|null|undefined} waves
     * @memberof AssetId
     * @instance
     */
    AssetId.prototype.waves = null;

    /**
     * AssetId issuedAsset.
     * @member {Uint8Array} issuedAsset
     * @memberof AssetId
     * @instance
     */
    AssetId.prototype.issuedAsset = $util.newBuffer([]);

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * AssetId asset.
     * @member {"waves"|"issuedAsset"|undefined} asset
     * @memberof AssetId
     * @instance
     */
    Object.defineProperty(AssetId.prototype, "asset", {
        get: $util.oneOfGetter($oneOfFields = ["waves", "issuedAsset"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new AssetId instance using the specified properties.
     * @function create
     * @memberof AssetId
     * @static
     * @param {IAssetId=} [properties] Properties to set
     * @returns {AssetId} AssetId instance
     */
    AssetId.create = function create(properties) {
        return new AssetId(properties);
    };

    /**
     * Encodes the specified AssetId message. Does not implicitly {@link AssetId.verify|verify} messages.
     * @function encode
     * @memberof AssetId
     * @static
     * @param {IAssetId} message AssetId message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AssetId.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.waves != null && message.hasOwnProperty("waves"))
            $root.google.protobuf.Empty.encode(message.waves, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.issuedAsset != null && message.hasOwnProperty("issuedAsset"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.issuedAsset);
        return writer;
    };

    /**
     * Encodes the specified AssetId message, length delimited. Does not implicitly {@link AssetId.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AssetId
     * @static
     * @param {IAssetId} message AssetId message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AssetId.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AssetId message from the specified reader or buffer.
     * @function decode
     * @memberof AssetId
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AssetId} AssetId
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AssetId.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AssetId();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.waves = $root.google.protobuf.Empty.decode(reader, reader.uint32());
                break;
            case 2:
                message.issuedAsset = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an AssetId message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AssetId
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AssetId} AssetId
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AssetId.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AssetId message.
     * @function verify
     * @memberof AssetId
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AssetId.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.waves != null && message.hasOwnProperty("waves")) {
            properties.asset = 1;
            {
                var error = $root.google.protobuf.Empty.verify(message.waves);
                if (error)
                    return "waves." + error;
            }
        }
        if (message.issuedAsset != null && message.hasOwnProperty("issuedAsset")) {
            if (properties.asset === 1)
                return "asset: multiple values";
            properties.asset = 1;
            if (!(message.issuedAsset && typeof message.issuedAsset.length === "number" || $util.isString(message.issuedAsset)))
                return "issuedAsset: buffer expected";
        }
        return null;
    };

    /**
     * Creates an AssetId message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AssetId
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AssetId} AssetId
     */
    AssetId.fromObject = function fromObject(object) {
        if (object instanceof $root.AssetId)
            return object;
        var message = new $root.AssetId();
        if (object.waves != null) {
            if (typeof object.waves !== "object")
                throw TypeError(".AssetId.waves: object expected");
            message.waves = $root.google.protobuf.Empty.fromObject(object.waves);
        }
        if (object.issuedAsset != null)
            if (typeof object.issuedAsset === "string")
                $util.base64.decode(object.issuedAsset, message.issuedAsset = $util.newBuffer($util.base64.length(object.issuedAsset)), 0);
            else if (object.issuedAsset.length)
                message.issuedAsset = object.issuedAsset;
        return message;
    };

    /**
     * Creates a plain object from an AssetId message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AssetId
     * @static
     * @param {AssetId} message AssetId
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AssetId.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.waves != null && message.hasOwnProperty("waves")) {
            object.waves = $root.google.protobuf.Empty.toObject(message.waves, options);
            if (options.oneofs)
                object.asset = "waves";
        }
        if (message.issuedAsset != null && message.hasOwnProperty("issuedAsset")) {
            object.issuedAsset = options.bytes === String ? $util.base64.encode(message.issuedAsset, 0, message.issuedAsset.length) : options.bytes === Array ? Array.prototype.slice.call(message.issuedAsset) : message.issuedAsset;
            if (options.oneofs)
                object.asset = "issuedAsset";
        }
        return object;
    };

    /**
     * Converts this AssetId to JSON.
     * @function toJSON
     * @memberof AssetId
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AssetId.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AssetId;
})();

$root.AssetAmount = (function() {

    /**
     * Properties of an AssetAmount.
     * @exports IAssetAmount
     * @interface IAssetAmount
     * @property {Uint8Array|null} [assetId] AssetAmount assetId
     * @property {Long|null} [amount] AssetAmount amount
     */

    /**
     * Constructs a new AssetAmount.
     * @exports AssetAmount
     * @classdesc Represents an AssetAmount.
     * @implements IAssetAmount
     * @constructor
     * @param {IAssetAmount=} [properties] Properties to set
     */
    function AssetAmount(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AssetAmount assetId.
     * @member {Uint8Array} assetId
     * @memberof AssetAmount
     * @instance
     */
    AssetAmount.prototype.assetId = $util.newBuffer([]);

    /**
     * AssetAmount amount.
     * @member {Long} amount
     * @memberof AssetAmount
     * @instance
     */
    AssetAmount.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Creates a new AssetAmount instance using the specified properties.
     * @function create
     * @memberof AssetAmount
     * @static
     * @param {IAssetAmount=} [properties] Properties to set
     * @returns {AssetAmount} AssetAmount instance
     */
    AssetAmount.create = function create(properties) {
        return new AssetAmount(properties);
    };

    /**
     * Encodes the specified AssetAmount message. Does not implicitly {@link AssetAmount.verify|verify} messages.
     * @function encode
     * @memberof AssetAmount
     * @static
     * @param {IAssetAmount} message AssetAmount message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AssetAmount.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.assetId != null && message.hasOwnProperty("assetId"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.assetId);
        if (message.amount != null && message.hasOwnProperty("amount"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.amount);
        return writer;
    };

    /**
     * Encodes the specified AssetAmount message, length delimited. Does not implicitly {@link AssetAmount.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AssetAmount
     * @static
     * @param {IAssetAmount} message AssetAmount message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AssetAmount.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AssetAmount message from the specified reader or buffer.
     * @function decode
     * @memberof AssetAmount
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AssetAmount} AssetAmount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AssetAmount.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AssetAmount();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.assetId = reader.bytes();
                break;
            case 2:
                message.amount = reader.int64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an AssetAmount message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AssetAmount
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AssetAmount} AssetAmount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AssetAmount.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AssetAmount message.
     * @function verify
     * @memberof AssetAmount
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AssetAmount.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.assetId != null && message.hasOwnProperty("assetId"))
            if (!(message.assetId && typeof message.assetId.length === "number" || $util.isString(message.assetId)))
                return "assetId: buffer expected";
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                return "amount: integer|Long expected";
        return null;
    };

    /**
     * Creates an AssetAmount message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AssetAmount
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AssetAmount} AssetAmount
     */
    AssetAmount.fromObject = function fromObject(object) {
        if (object instanceof $root.AssetAmount)
            return object;
        var message = new $root.AssetAmount();
        if (object.assetId != null)
            if (typeof object.assetId === "string")
                $util.base64.decode(object.assetId, message.assetId = $util.newBuffer($util.base64.length(object.assetId)), 0);
            else if (object.assetId.length)
                message.assetId = object.assetId;
        if (object.amount != null)
            if ($util.Long)
                (message.amount = $util.Long.fromValue(object.amount)).unsigned = false;
            else if (typeof object.amount === "string")
                message.amount = parseInt(object.amount, 10);
            else if (typeof object.amount === "number")
                message.amount = object.amount;
            else if (typeof object.amount === "object")
                message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber();
        return message;
    };

    /**
     * Creates a plain object from an AssetAmount message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AssetAmount
     * @static
     * @param {AssetAmount} message AssetAmount
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AssetAmount.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.assetId = "";
            else {
                object.assetId = [];
                if (options.bytes !== Array)
                    object.assetId = $util.newBuffer(object.assetId);
            }
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.amount = options.longs === String ? "0" : 0;
        }
        if (message.assetId != null && message.hasOwnProperty("assetId"))
            object.assetId = options.bytes === String ? $util.base64.encode(message.assetId, 0, message.assetId.length) : options.bytes === Array ? Array.prototype.slice.call(message.assetId) : message.assetId;
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (typeof message.amount === "number")
                object.amount = options.longs === String ? String(message.amount) : message.amount;
            else
                object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber() : message.amount;
        return object;
    };

    /**
     * Converts this AssetAmount to JSON.
     * @function toJSON
     * @memberof AssetAmount
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AssetAmount.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AssetAmount;
})();

$root.Amount = (function() {

    /**
     * Properties of an Amount.
     * @exports IAmount
     * @interface IAmount
     * @property {IAssetId|null} [assetId] Amount assetId
     * @property {Long|null} [amount] Amount amount
     */

    /**
     * Constructs a new Amount.
     * @exports Amount
     * @classdesc Represents an Amount.
     * @implements IAmount
     * @constructor
     * @param {IAmount=} [properties] Properties to set
     */
    function Amount(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Amount assetId.
     * @member {IAssetId|null|undefined} assetId
     * @memberof Amount
     * @instance
     */
    Amount.prototype.assetId = null;

    /**
     * Amount amount.
     * @member {Long} amount
     * @memberof Amount
     * @instance
     */
    Amount.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Creates a new Amount instance using the specified properties.
     * @function create
     * @memberof Amount
     * @static
     * @param {IAmount=} [properties] Properties to set
     * @returns {Amount} Amount instance
     */
    Amount.create = function create(properties) {
        return new Amount(properties);
    };

    /**
     * Encodes the specified Amount message. Does not implicitly {@link Amount.verify|verify} messages.
     * @function encode
     * @memberof Amount
     * @static
     * @param {IAmount} message Amount message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Amount.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.assetId != null && message.hasOwnProperty("assetId"))
            $root.AssetId.encode(message.assetId, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.amount != null && message.hasOwnProperty("amount"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.amount);
        return writer;
    };

    /**
     * Encodes the specified Amount message, length delimited. Does not implicitly {@link Amount.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Amount
     * @static
     * @param {IAmount} message Amount message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Amount.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Amount message from the specified reader or buffer.
     * @function decode
     * @memberof Amount
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Amount} Amount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Amount.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Amount();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.assetId = $root.AssetId.decode(reader, reader.uint32());
                break;
            case 2:
                message.amount = reader.int64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Amount message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Amount
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Amount} Amount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Amount.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Amount message.
     * @function verify
     * @memberof Amount
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Amount.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.assetId != null && message.hasOwnProperty("assetId")) {
            var error = $root.AssetId.verify(message.assetId);
            if (error)
                return "assetId." + error;
        }
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                return "amount: integer|Long expected";
        return null;
    };

    /**
     * Creates an Amount message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Amount
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Amount} Amount
     */
    Amount.fromObject = function fromObject(object) {
        if (object instanceof $root.Amount)
            return object;
        var message = new $root.Amount();
        if (object.assetId != null) {
            if (typeof object.assetId !== "object")
                throw TypeError(".Amount.assetId: object expected");
            message.assetId = $root.AssetId.fromObject(object.assetId);
        }
        if (object.amount != null)
            if ($util.Long)
                (message.amount = $util.Long.fromValue(object.amount)).unsigned = false;
            else if (typeof object.amount === "string")
                message.amount = parseInt(object.amount, 10);
            else if (typeof object.amount === "number")
                message.amount = object.amount;
            else if (typeof object.amount === "object")
                message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber();
        return message;
    };

    /**
     * Creates a plain object from an Amount message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Amount
     * @static
     * @param {Amount} message Amount
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Amount.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.assetId = null;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.amount = options.longs === String ? "0" : 0;
        }
        if (message.assetId != null && message.hasOwnProperty("assetId"))
            object.assetId = $root.AssetId.toObject(message.assetId, options);
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (typeof message.amount === "number")
                object.amount = options.longs === String ? String(message.amount) : message.amount;
            else
                object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber() : message.amount;
        return object;
    };

    /**
     * Converts this Amount to JSON.
     * @function toJSON
     * @memberof Amount
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Amount.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Amount;
})();

$root.SignedTransaction = (function() {

    /**
     * Properties of a SignedTransaction.
     * @exports ISignedTransaction
     * @interface ISignedTransaction
     * @property {ITransaction|null} [transaction] SignedTransaction transaction
     * @property {Array.<Uint8Array>|null} [proofs] SignedTransaction proofs
     */

    /**
     * Constructs a new SignedTransaction.
     * @exports SignedTransaction
     * @classdesc Represents a SignedTransaction.
     * @implements ISignedTransaction
     * @constructor
     * @param {ISignedTransaction=} [properties] Properties to set
     */
    function SignedTransaction(properties) {
        this.proofs = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SignedTransaction transaction.
     * @member {ITransaction|null|undefined} transaction
     * @memberof SignedTransaction
     * @instance
     */
    SignedTransaction.prototype.transaction = null;

    /**
     * SignedTransaction proofs.
     * @member {Array.<Uint8Array>} proofs
     * @memberof SignedTransaction
     * @instance
     */
    SignedTransaction.prototype.proofs = $util.emptyArray;

    /**
     * Creates a new SignedTransaction instance using the specified properties.
     * @function create
     * @memberof SignedTransaction
     * @static
     * @param {ISignedTransaction=} [properties] Properties to set
     * @returns {SignedTransaction} SignedTransaction instance
     */
    SignedTransaction.create = function create(properties) {
        return new SignedTransaction(properties);
    };

    /**
     * Encodes the specified SignedTransaction message. Does not implicitly {@link SignedTransaction.verify|verify} messages.
     * @function encode
     * @memberof SignedTransaction
     * @static
     * @param {ISignedTransaction} message SignedTransaction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SignedTransaction.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.transaction != null && message.hasOwnProperty("transaction"))
            $root.Transaction.encode(message.transaction, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.proofs != null && message.proofs.length)
            for (var i = 0; i < message.proofs.length; ++i)
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.proofs[i]);
        return writer;
    };

    /**
     * Encodes the specified SignedTransaction message, length delimited. Does not implicitly {@link SignedTransaction.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SignedTransaction
     * @static
     * @param {ISignedTransaction} message SignedTransaction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SignedTransaction.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SignedTransaction message from the specified reader or buffer.
     * @function decode
     * @memberof SignedTransaction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SignedTransaction} SignedTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SignedTransaction.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SignedTransaction();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.transaction = $root.Transaction.decode(reader, reader.uint32());
                break;
            case 2:
                if (!(message.proofs && message.proofs.length))
                    message.proofs = [];
                message.proofs.push(reader.bytes());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SignedTransaction message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SignedTransaction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SignedTransaction} SignedTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SignedTransaction.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SignedTransaction message.
     * @function verify
     * @memberof SignedTransaction
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SignedTransaction.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.transaction != null && message.hasOwnProperty("transaction")) {
            var error = $root.Transaction.verify(message.transaction);
            if (error)
                return "transaction." + error;
        }
        if (message.proofs != null && message.hasOwnProperty("proofs")) {
            if (!Array.isArray(message.proofs))
                return "proofs: array expected";
            for (var i = 0; i < message.proofs.length; ++i)
                if (!(message.proofs[i] && typeof message.proofs[i].length === "number" || $util.isString(message.proofs[i])))
                    return "proofs: buffer[] expected";
        }
        return null;
    };

    /**
     * Creates a SignedTransaction message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SignedTransaction
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SignedTransaction} SignedTransaction
     */
    SignedTransaction.fromObject = function fromObject(object) {
        if (object instanceof $root.SignedTransaction)
            return object;
        var message = new $root.SignedTransaction();
        if (object.transaction != null) {
            if (typeof object.transaction !== "object")
                throw TypeError(".SignedTransaction.transaction: object expected");
            message.transaction = $root.Transaction.fromObject(object.transaction);
        }
        if (object.proofs) {
            if (!Array.isArray(object.proofs))
                throw TypeError(".SignedTransaction.proofs: array expected");
            message.proofs = [];
            for (var i = 0; i < object.proofs.length; ++i)
                if (typeof object.proofs[i] === "string")
                    $util.base64.decode(object.proofs[i], message.proofs[i] = $util.newBuffer($util.base64.length(object.proofs[i])), 0);
                else if (object.proofs[i].length)
                    message.proofs[i] = object.proofs[i];
        }
        return message;
    };

    /**
     * Creates a plain object from a SignedTransaction message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SignedTransaction
     * @static
     * @param {SignedTransaction} message SignedTransaction
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SignedTransaction.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.proofs = [];
        if (options.defaults)
            object.transaction = null;
        if (message.transaction != null && message.hasOwnProperty("transaction"))
            object.transaction = $root.Transaction.toObject(message.transaction, options);
        if (message.proofs && message.proofs.length) {
            object.proofs = [];
            for (var j = 0; j < message.proofs.length; ++j)
                object.proofs[j] = options.bytes === String ? $util.base64.encode(message.proofs[j], 0, message.proofs[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.proofs[j]) : message.proofs[j];
        }
        return object;
    };

    /**
     * Converts this SignedTransaction to JSON.
     * @function toJSON
     * @memberof SignedTransaction
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SignedTransaction.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SignedTransaction;
})();

$root.Transaction = (function() {

    /**
     * Properties of a Transaction.
     * @exports ITransaction
     * @interface ITransaction
     * @property {number|null} [chainId] Transaction chainId
     * @property {Uint8Array|null} [senderPublicKey] Transaction senderPublicKey
     * @property {IAmount|null} [fee] Transaction fee
     * @property {Long|null} [timestamp] Transaction timestamp
     * @property {number|null} [version] Transaction version
     * @property {IGenesisTransactionData|null} [genesis] Transaction genesis
     * @property {IPaymentTransactionData|null} [payment] Transaction payment
     * @property {IIssueTransactionData|null} [issue] Transaction issue
     * @property {ITransferTransactionData|null} [transfer] Transaction transfer
     * @property {IReissueTransactionData|null} [reissue] Transaction reissue
     * @property {IBurnTransactionData|null} [burn] Transaction burn
     * @property {IExchangeTransactionData|null} [exchange] Transaction exchange
     * @property {ILeaseTransactionData|null} [lease] Transaction lease
     * @property {ILeaseCancelTransactionData|null} [leaseCancel] Transaction leaseCancel
     * @property {ICreateAliasTransactionData|null} [createAlias] Transaction createAlias
     * @property {IMassTransferTransactionData|null} [massTransfer] Transaction massTransfer
     * @property {IDataTransactionData|null} [dataTransaction] Transaction dataTransaction
     * @property {ISetScriptTransactionData|null} [setScript] Transaction setScript
     * @property {ISponsorFeeTransactionData|null} [sponsorFee] Transaction sponsorFee
     * @property {ISetAssetScriptTransactionData|null} [setAssetScript] Transaction setAssetScript
     * @property {IInvokeScriptTransactionData|null} [invokeScript] Transaction invokeScript
     */

    /**
     * Constructs a new Transaction.
     * @exports Transaction
     * @classdesc Represents a Transaction.
     * @implements ITransaction
     * @constructor
     * @param {ITransaction=} [properties] Properties to set
     */
    function Transaction(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Transaction chainId.
     * @member {number} chainId
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.chainId = 0;

    /**
     * Transaction senderPublicKey.
     * @member {Uint8Array} senderPublicKey
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.senderPublicKey = $util.newBuffer([]);

    /**
     * Transaction fee.
     * @member {IAmount|null|undefined} fee
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.fee = null;

    /**
     * Transaction timestamp.
     * @member {Long} timestamp
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Transaction version.
     * @member {number} version
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.version = 0;

    /**
     * Transaction genesis.
     * @member {IGenesisTransactionData|null|undefined} genesis
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.genesis = null;

    /**
     * Transaction payment.
     * @member {IPaymentTransactionData|null|undefined} payment
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.payment = null;

    /**
     * Transaction issue.
     * @member {IIssueTransactionData|null|undefined} issue
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.issue = null;

    /**
     * Transaction transfer.
     * @member {ITransferTransactionData|null|undefined} transfer
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.transfer = null;

    /**
     * Transaction reissue.
     * @member {IReissueTransactionData|null|undefined} reissue
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.reissue = null;

    /**
     * Transaction burn.
     * @member {IBurnTransactionData|null|undefined} burn
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.burn = null;

    /**
     * Transaction exchange.
     * @member {IExchangeTransactionData|null|undefined} exchange
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.exchange = null;

    /**
     * Transaction lease.
     * @member {ILeaseTransactionData|null|undefined} lease
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.lease = null;

    /**
     * Transaction leaseCancel.
     * @member {ILeaseCancelTransactionData|null|undefined} leaseCancel
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.leaseCancel = null;

    /**
     * Transaction createAlias.
     * @member {ICreateAliasTransactionData|null|undefined} createAlias
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.createAlias = null;

    /**
     * Transaction massTransfer.
     * @member {IMassTransferTransactionData|null|undefined} massTransfer
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.massTransfer = null;

    /**
     * Transaction dataTransaction.
     * @member {IDataTransactionData|null|undefined} dataTransaction
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.dataTransaction = null;

    /**
     * Transaction setScript.
     * @member {ISetScriptTransactionData|null|undefined} setScript
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.setScript = null;

    /**
     * Transaction sponsorFee.
     * @member {ISponsorFeeTransactionData|null|undefined} sponsorFee
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.sponsorFee = null;

    /**
     * Transaction setAssetScript.
     * @member {ISetAssetScriptTransactionData|null|undefined} setAssetScript
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.setAssetScript = null;

    /**
     * Transaction invokeScript.
     * @member {IInvokeScriptTransactionData|null|undefined} invokeScript
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.invokeScript = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * Transaction data.
     * @member {"genesis"|"payment"|"issue"|"transfer"|"reissue"|"burn"|"exchange"|"lease"|"leaseCancel"|"createAlias"|"massTransfer"|"dataTransaction"|"setScript"|"sponsorFee"|"setAssetScript"|"invokeScript"|undefined} data
     * @memberof Transaction
     * @instance
     */
    Object.defineProperty(Transaction.prototype, "data", {
        get: $util.oneOfGetter($oneOfFields = ["genesis", "payment", "issue", "transfer", "reissue", "burn", "exchange", "lease", "leaseCancel", "createAlias", "massTransfer", "dataTransaction", "setScript", "sponsorFee", "setAssetScript", "invokeScript"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Transaction instance using the specified properties.
     * @function create
     * @memberof Transaction
     * @static
     * @param {ITransaction=} [properties] Properties to set
     * @returns {Transaction} Transaction instance
     */
    Transaction.create = function create(properties) {
        return new Transaction(properties);
    };

    /**
     * Encodes the specified Transaction message. Does not implicitly {@link Transaction.verify|verify} messages.
     * @function encode
     * @memberof Transaction
     * @static
     * @param {ITransaction} message Transaction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Transaction.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.chainId != null && message.hasOwnProperty("chainId"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.chainId);
        if (message.senderPublicKey != null && message.hasOwnProperty("senderPublicKey"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.senderPublicKey);
        if (message.fee != null && message.hasOwnProperty("fee"))
            $root.Amount.encode(message.fee, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            writer.uint32(/* id 4, wireType 0 =*/32).int64(message.timestamp);
        if (message.version != null && message.hasOwnProperty("version"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.version);
        if (message.genesis != null && message.hasOwnProperty("genesis"))
            $root.GenesisTransactionData.encode(message.genesis, writer.uint32(/* id 101, wireType 2 =*/810).fork()).ldelim();
        if (message.payment != null && message.hasOwnProperty("payment"))
            $root.PaymentTransactionData.encode(message.payment, writer.uint32(/* id 102, wireType 2 =*/818).fork()).ldelim();
        if (message.issue != null && message.hasOwnProperty("issue"))
            $root.IssueTransactionData.encode(message.issue, writer.uint32(/* id 103, wireType 2 =*/826).fork()).ldelim();
        if (message.transfer != null && message.hasOwnProperty("transfer"))
            $root.TransferTransactionData.encode(message.transfer, writer.uint32(/* id 104, wireType 2 =*/834).fork()).ldelim();
        if (message.reissue != null && message.hasOwnProperty("reissue"))
            $root.ReissueTransactionData.encode(message.reissue, writer.uint32(/* id 105, wireType 2 =*/842).fork()).ldelim();
        if (message.burn != null && message.hasOwnProperty("burn"))
            $root.BurnTransactionData.encode(message.burn, writer.uint32(/* id 106, wireType 2 =*/850).fork()).ldelim();
        if (message.exchange != null && message.hasOwnProperty("exchange"))
            $root.ExchangeTransactionData.encode(message.exchange, writer.uint32(/* id 107, wireType 2 =*/858).fork()).ldelim();
        if (message.lease != null && message.hasOwnProperty("lease"))
            $root.LeaseTransactionData.encode(message.lease, writer.uint32(/* id 108, wireType 2 =*/866).fork()).ldelim();
        if (message.leaseCancel != null && message.hasOwnProperty("leaseCancel"))
            $root.LeaseCancelTransactionData.encode(message.leaseCancel, writer.uint32(/* id 109, wireType 2 =*/874).fork()).ldelim();
        if (message.createAlias != null && message.hasOwnProperty("createAlias"))
            $root.CreateAliasTransactionData.encode(message.createAlias, writer.uint32(/* id 110, wireType 2 =*/882).fork()).ldelim();
        if (message.massTransfer != null && message.hasOwnProperty("massTransfer"))
            $root.MassTransferTransactionData.encode(message.massTransfer, writer.uint32(/* id 111, wireType 2 =*/890).fork()).ldelim();
        if (message.dataTransaction != null && message.hasOwnProperty("dataTransaction"))
            $root.DataTransactionData.encode(message.dataTransaction, writer.uint32(/* id 112, wireType 2 =*/898).fork()).ldelim();
        if (message.setScript != null && message.hasOwnProperty("setScript"))
            $root.SetScriptTransactionData.encode(message.setScript, writer.uint32(/* id 113, wireType 2 =*/906).fork()).ldelim();
        if (message.sponsorFee != null && message.hasOwnProperty("sponsorFee"))
            $root.SponsorFeeTransactionData.encode(message.sponsorFee, writer.uint32(/* id 114, wireType 2 =*/914).fork()).ldelim();
        if (message.setAssetScript != null && message.hasOwnProperty("setAssetScript"))
            $root.SetAssetScriptTransactionData.encode(message.setAssetScript, writer.uint32(/* id 115, wireType 2 =*/922).fork()).ldelim();
        if (message.invokeScript != null && message.hasOwnProperty("invokeScript"))
            $root.InvokeScriptTransactionData.encode(message.invokeScript, writer.uint32(/* id 116, wireType 2 =*/930).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Transaction message, length delimited. Does not implicitly {@link Transaction.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Transaction
     * @static
     * @param {ITransaction} message Transaction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Transaction.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Transaction message from the specified reader or buffer.
     * @function decode
     * @memberof Transaction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Transaction} Transaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Transaction.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Transaction();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.chainId = reader.int32();
                break;
            case 2:
                message.senderPublicKey = reader.bytes();
                break;
            case 3:
                message.fee = $root.Amount.decode(reader, reader.uint32());
                break;
            case 4:
                message.timestamp = reader.int64();
                break;
            case 5:
                message.version = reader.int32();
                break;
            case 101:
                message.genesis = $root.GenesisTransactionData.decode(reader, reader.uint32());
                break;
            case 102:
                message.payment = $root.PaymentTransactionData.decode(reader, reader.uint32());
                break;
            case 103:
                message.issue = $root.IssueTransactionData.decode(reader, reader.uint32());
                break;
            case 104:
                message.transfer = $root.TransferTransactionData.decode(reader, reader.uint32());
                break;
            case 105:
                message.reissue = $root.ReissueTransactionData.decode(reader, reader.uint32());
                break;
            case 106:
                message.burn = $root.BurnTransactionData.decode(reader, reader.uint32());
                break;
            case 107:
                message.exchange = $root.ExchangeTransactionData.decode(reader, reader.uint32());
                break;
            case 108:
                message.lease = $root.LeaseTransactionData.decode(reader, reader.uint32());
                break;
            case 109:
                message.leaseCancel = $root.LeaseCancelTransactionData.decode(reader, reader.uint32());
                break;
            case 110:
                message.createAlias = $root.CreateAliasTransactionData.decode(reader, reader.uint32());
                break;
            case 111:
                message.massTransfer = $root.MassTransferTransactionData.decode(reader, reader.uint32());
                break;
            case 112:
                message.dataTransaction = $root.DataTransactionData.decode(reader, reader.uint32());
                break;
            case 113:
                message.setScript = $root.SetScriptTransactionData.decode(reader, reader.uint32());
                break;
            case 114:
                message.sponsorFee = $root.SponsorFeeTransactionData.decode(reader, reader.uint32());
                break;
            case 115:
                message.setAssetScript = $root.SetAssetScriptTransactionData.decode(reader, reader.uint32());
                break;
            case 116:
                message.invokeScript = $root.InvokeScriptTransactionData.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Transaction message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Transaction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Transaction} Transaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Transaction.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Transaction message.
     * @function verify
     * @memberof Transaction
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Transaction.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.chainId != null && message.hasOwnProperty("chainId"))
            if (!$util.isInteger(message.chainId))
                return "chainId: integer expected";
        if (message.senderPublicKey != null && message.hasOwnProperty("senderPublicKey"))
            if (!(message.senderPublicKey && typeof message.senderPublicKey.length === "number" || $util.isString(message.senderPublicKey)))
                return "senderPublicKey: buffer expected";
        if (message.fee != null && message.hasOwnProperty("fee")) {
            var error = $root.Amount.verify(message.fee);
            if (error)
                return "fee." + error;
        }
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                return "timestamp: integer|Long expected";
        if (message.version != null && message.hasOwnProperty("version"))
            if (!$util.isInteger(message.version))
                return "version: integer expected";
        if (message.genesis != null && message.hasOwnProperty("genesis")) {
            properties.data = 1;
            {
                var error = $root.GenesisTransactionData.verify(message.genesis);
                if (error)
                    return "genesis." + error;
            }
        }
        if (message.payment != null && message.hasOwnProperty("payment")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.PaymentTransactionData.verify(message.payment);
                if (error)
                    return "payment." + error;
            }
        }
        if (message.issue != null && message.hasOwnProperty("issue")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.IssueTransactionData.verify(message.issue);
                if (error)
                    return "issue." + error;
            }
        }
        if (message.transfer != null && message.hasOwnProperty("transfer")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.TransferTransactionData.verify(message.transfer);
                if (error)
                    return "transfer." + error;
            }
        }
        if (message.reissue != null && message.hasOwnProperty("reissue")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.ReissueTransactionData.verify(message.reissue);
                if (error)
                    return "reissue." + error;
            }
        }
        if (message.burn != null && message.hasOwnProperty("burn")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.BurnTransactionData.verify(message.burn);
                if (error)
                    return "burn." + error;
            }
        }
        if (message.exchange != null && message.hasOwnProperty("exchange")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.ExchangeTransactionData.verify(message.exchange);
                if (error)
                    return "exchange." + error;
            }
        }
        if (message.lease != null && message.hasOwnProperty("lease")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.LeaseTransactionData.verify(message.lease);
                if (error)
                    return "lease." + error;
            }
        }
        if (message.leaseCancel != null && message.hasOwnProperty("leaseCancel")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.LeaseCancelTransactionData.verify(message.leaseCancel);
                if (error)
                    return "leaseCancel." + error;
            }
        }
        if (message.createAlias != null && message.hasOwnProperty("createAlias")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.CreateAliasTransactionData.verify(message.createAlias);
                if (error)
                    return "createAlias." + error;
            }
        }
        if (message.massTransfer != null && message.hasOwnProperty("massTransfer")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.MassTransferTransactionData.verify(message.massTransfer);
                if (error)
                    return "massTransfer." + error;
            }
        }
        if (message.dataTransaction != null && message.hasOwnProperty("dataTransaction")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.DataTransactionData.verify(message.dataTransaction);
                if (error)
                    return "dataTransaction." + error;
            }
        }
        if (message.setScript != null && message.hasOwnProperty("setScript")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.SetScriptTransactionData.verify(message.setScript);
                if (error)
                    return "setScript." + error;
            }
        }
        if (message.sponsorFee != null && message.hasOwnProperty("sponsorFee")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.SponsorFeeTransactionData.verify(message.sponsorFee);
                if (error)
                    return "sponsorFee." + error;
            }
        }
        if (message.setAssetScript != null && message.hasOwnProperty("setAssetScript")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.SetAssetScriptTransactionData.verify(message.setAssetScript);
                if (error)
                    return "setAssetScript." + error;
            }
        }
        if (message.invokeScript != null && message.hasOwnProperty("invokeScript")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.InvokeScriptTransactionData.verify(message.invokeScript);
                if (error)
                    return "invokeScript." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Transaction message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Transaction
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Transaction} Transaction
     */
    Transaction.fromObject = function fromObject(object) {
        if (object instanceof $root.Transaction)
            return object;
        var message = new $root.Transaction();
        if (object.chainId != null)
            message.chainId = object.chainId | 0;
        if (object.senderPublicKey != null)
            if (typeof object.senderPublicKey === "string")
                $util.base64.decode(object.senderPublicKey, message.senderPublicKey = $util.newBuffer($util.base64.length(object.senderPublicKey)), 0);
            else if (object.senderPublicKey.length)
                message.senderPublicKey = object.senderPublicKey;
        if (object.fee != null) {
            if (typeof object.fee !== "object")
                throw TypeError(".Transaction.fee: object expected");
            message.fee = $root.Amount.fromObject(object.fee);
        }
        if (object.timestamp != null)
            if ($util.Long)
                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
            else if (typeof object.timestamp === "string")
                message.timestamp = parseInt(object.timestamp, 10);
            else if (typeof object.timestamp === "number")
                message.timestamp = object.timestamp;
            else if (typeof object.timestamp === "object")
                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
        if (object.version != null)
            message.version = object.version | 0;
        if (object.genesis != null) {
            if (typeof object.genesis !== "object")
                throw TypeError(".Transaction.genesis: object expected");
            message.genesis = $root.GenesisTransactionData.fromObject(object.genesis);
        }
        if (object.payment != null) {
            if (typeof object.payment !== "object")
                throw TypeError(".Transaction.payment: object expected");
            message.payment = $root.PaymentTransactionData.fromObject(object.payment);
        }
        if (object.issue != null) {
            if (typeof object.issue !== "object")
                throw TypeError(".Transaction.issue: object expected");
            message.issue = $root.IssueTransactionData.fromObject(object.issue);
        }
        if (object.transfer != null) {
            if (typeof object.transfer !== "object")
                throw TypeError(".Transaction.transfer: object expected");
            message.transfer = $root.TransferTransactionData.fromObject(object.transfer);
        }
        if (object.reissue != null) {
            if (typeof object.reissue !== "object")
                throw TypeError(".Transaction.reissue: object expected");
            message.reissue = $root.ReissueTransactionData.fromObject(object.reissue);
        }
        if (object.burn != null) {
            if (typeof object.burn !== "object")
                throw TypeError(".Transaction.burn: object expected");
            message.burn = $root.BurnTransactionData.fromObject(object.burn);
        }
        if (object.exchange != null) {
            if (typeof object.exchange !== "object")
                throw TypeError(".Transaction.exchange: object expected");
            message.exchange = $root.ExchangeTransactionData.fromObject(object.exchange);
        }
        if (object.lease != null) {
            if (typeof object.lease !== "object")
                throw TypeError(".Transaction.lease: object expected");
            message.lease = $root.LeaseTransactionData.fromObject(object.lease);
        }
        if (object.leaseCancel != null) {
            if (typeof object.leaseCancel !== "object")
                throw TypeError(".Transaction.leaseCancel: object expected");
            message.leaseCancel = $root.LeaseCancelTransactionData.fromObject(object.leaseCancel);
        }
        if (object.createAlias != null) {
            if (typeof object.createAlias !== "object")
                throw TypeError(".Transaction.createAlias: object expected");
            message.createAlias = $root.CreateAliasTransactionData.fromObject(object.createAlias);
        }
        if (object.massTransfer != null) {
            if (typeof object.massTransfer !== "object")
                throw TypeError(".Transaction.massTransfer: object expected");
            message.massTransfer = $root.MassTransferTransactionData.fromObject(object.massTransfer);
        }
        if (object.dataTransaction != null) {
            if (typeof object.dataTransaction !== "object")
                throw TypeError(".Transaction.dataTransaction: object expected");
            message.dataTransaction = $root.DataTransactionData.fromObject(object.dataTransaction);
        }
        if (object.setScript != null) {
            if (typeof object.setScript !== "object")
                throw TypeError(".Transaction.setScript: object expected");
            message.setScript = $root.SetScriptTransactionData.fromObject(object.setScript);
        }
        if (object.sponsorFee != null) {
            if (typeof object.sponsorFee !== "object")
                throw TypeError(".Transaction.sponsorFee: object expected");
            message.sponsorFee = $root.SponsorFeeTransactionData.fromObject(object.sponsorFee);
        }
        if (object.setAssetScript != null) {
            if (typeof object.setAssetScript !== "object")
                throw TypeError(".Transaction.setAssetScript: object expected");
            message.setAssetScript = $root.SetAssetScriptTransactionData.fromObject(object.setAssetScript);
        }
        if (object.invokeScript != null) {
            if (typeof object.invokeScript !== "object")
                throw TypeError(".Transaction.invokeScript: object expected");
            message.invokeScript = $root.InvokeScriptTransactionData.fromObject(object.invokeScript);
        }
        return message;
    };

    /**
     * Creates a plain object from a Transaction message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Transaction
     * @static
     * @param {Transaction} message Transaction
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Transaction.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.chainId = 0;
            if (options.bytes === String)
                object.senderPublicKey = "";
            else {
                object.senderPublicKey = [];
                if (options.bytes !== Array)
                    object.senderPublicKey = $util.newBuffer(object.senderPublicKey);
            }
            object.fee = null;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.timestamp = options.longs === String ? "0" : 0;
            object.version = 0;
        }
        if (message.chainId != null && message.hasOwnProperty("chainId"))
            object.chainId = message.chainId;
        if (message.senderPublicKey != null && message.hasOwnProperty("senderPublicKey"))
            object.senderPublicKey = options.bytes === String ? $util.base64.encode(message.senderPublicKey, 0, message.senderPublicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.senderPublicKey) : message.senderPublicKey;
        if (message.fee != null && message.hasOwnProperty("fee"))
            object.fee = $root.Amount.toObject(message.fee, options);
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (typeof message.timestamp === "number")
                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
            else
                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
        if (message.version != null && message.hasOwnProperty("version"))
            object.version = message.version;
        if (message.genesis != null && message.hasOwnProperty("genesis")) {
            object.genesis = $root.GenesisTransactionData.toObject(message.genesis, options);
            if (options.oneofs)
                object.data = "genesis";
        }
        if (message.payment != null && message.hasOwnProperty("payment")) {
            object.payment = $root.PaymentTransactionData.toObject(message.payment, options);
            if (options.oneofs)
                object.data = "payment";
        }
        if (message.issue != null && message.hasOwnProperty("issue")) {
            object.issue = $root.IssueTransactionData.toObject(message.issue, options);
            if (options.oneofs)
                object.data = "issue";
        }
        if (message.transfer != null && message.hasOwnProperty("transfer")) {
            object.transfer = $root.TransferTransactionData.toObject(message.transfer, options);
            if (options.oneofs)
                object.data = "transfer";
        }
        if (message.reissue != null && message.hasOwnProperty("reissue")) {
            object.reissue = $root.ReissueTransactionData.toObject(message.reissue, options);
            if (options.oneofs)
                object.data = "reissue";
        }
        if (message.burn != null && message.hasOwnProperty("burn")) {
            object.burn = $root.BurnTransactionData.toObject(message.burn, options);
            if (options.oneofs)
                object.data = "burn";
        }
        if (message.exchange != null && message.hasOwnProperty("exchange")) {
            object.exchange = $root.ExchangeTransactionData.toObject(message.exchange, options);
            if (options.oneofs)
                object.data = "exchange";
        }
        if (message.lease != null && message.hasOwnProperty("lease")) {
            object.lease = $root.LeaseTransactionData.toObject(message.lease, options);
            if (options.oneofs)
                object.data = "lease";
        }
        if (message.leaseCancel != null && message.hasOwnProperty("leaseCancel")) {
            object.leaseCancel = $root.LeaseCancelTransactionData.toObject(message.leaseCancel, options);
            if (options.oneofs)
                object.data = "leaseCancel";
        }
        if (message.createAlias != null && message.hasOwnProperty("createAlias")) {
            object.createAlias = $root.CreateAliasTransactionData.toObject(message.createAlias, options);
            if (options.oneofs)
                object.data = "createAlias";
        }
        if (message.massTransfer != null && message.hasOwnProperty("massTransfer")) {
            object.massTransfer = $root.MassTransferTransactionData.toObject(message.massTransfer, options);
            if (options.oneofs)
                object.data = "massTransfer";
        }
        if (message.dataTransaction != null && message.hasOwnProperty("dataTransaction")) {
            object.dataTransaction = $root.DataTransactionData.toObject(message.dataTransaction, options);
            if (options.oneofs)
                object.data = "dataTransaction";
        }
        if (message.setScript != null && message.hasOwnProperty("setScript")) {
            object.setScript = $root.SetScriptTransactionData.toObject(message.setScript, options);
            if (options.oneofs)
                object.data = "setScript";
        }
        if (message.sponsorFee != null && message.hasOwnProperty("sponsorFee")) {
            object.sponsorFee = $root.SponsorFeeTransactionData.toObject(message.sponsorFee, options);
            if (options.oneofs)
                object.data = "sponsorFee";
        }
        if (message.setAssetScript != null && message.hasOwnProperty("setAssetScript")) {
            object.setAssetScript = $root.SetAssetScriptTransactionData.toObject(message.setAssetScript, options);
            if (options.oneofs)
                object.data = "setAssetScript";
        }
        if (message.invokeScript != null && message.hasOwnProperty("invokeScript")) {
            object.invokeScript = $root.InvokeScriptTransactionData.toObject(message.invokeScript, options);
            if (options.oneofs)
                object.data = "invokeScript";
        }
        return object;
    };

    /**
     * Converts this Transaction to JSON.
     * @function toJSON
     * @memberof Transaction
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Transaction.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Transaction;
})();

$root.GenesisTransactionData = (function() {

    /**
     * Properties of a GenesisTransactionData.
     * @exports IGenesisTransactionData
     * @interface IGenesisTransactionData
     * @property {Uint8Array|null} [recipientAddress] GenesisTransactionData recipientAddress
     * @property {Long|null} [amount] GenesisTransactionData amount
     */

    /**
     * Constructs a new GenesisTransactionData.
     * @exports GenesisTransactionData
     * @classdesc Represents a GenesisTransactionData.
     * @implements IGenesisTransactionData
     * @constructor
     * @param {IGenesisTransactionData=} [properties] Properties to set
     */
    function GenesisTransactionData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GenesisTransactionData recipientAddress.
     * @member {Uint8Array} recipientAddress
     * @memberof GenesisTransactionData
     * @instance
     */
    GenesisTransactionData.prototype.recipientAddress = $util.newBuffer([]);

    /**
     * GenesisTransactionData amount.
     * @member {Long} amount
     * @memberof GenesisTransactionData
     * @instance
     */
    GenesisTransactionData.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Creates a new GenesisTransactionData instance using the specified properties.
     * @function create
     * @memberof GenesisTransactionData
     * @static
     * @param {IGenesisTransactionData=} [properties] Properties to set
     * @returns {GenesisTransactionData} GenesisTransactionData instance
     */
    GenesisTransactionData.create = function create(properties) {
        return new GenesisTransactionData(properties);
    };

    /**
     * Encodes the specified GenesisTransactionData message. Does not implicitly {@link GenesisTransactionData.verify|verify} messages.
     * @function encode
     * @memberof GenesisTransactionData
     * @static
     * @param {IGenesisTransactionData} message GenesisTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GenesisTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.recipientAddress != null && message.hasOwnProperty("recipientAddress"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.recipientAddress);
        if (message.amount != null && message.hasOwnProperty("amount"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.amount);
        return writer;
    };

    /**
     * Encodes the specified GenesisTransactionData message, length delimited. Does not implicitly {@link GenesisTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GenesisTransactionData
     * @static
     * @param {IGenesisTransactionData} message GenesisTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GenesisTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GenesisTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof GenesisTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GenesisTransactionData} GenesisTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GenesisTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GenesisTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.recipientAddress = reader.bytes();
                break;
            case 2:
                message.amount = reader.int64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GenesisTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GenesisTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GenesisTransactionData} GenesisTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GenesisTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GenesisTransactionData message.
     * @function verify
     * @memberof GenesisTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GenesisTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.recipientAddress != null && message.hasOwnProperty("recipientAddress"))
            if (!(message.recipientAddress && typeof message.recipientAddress.length === "number" || $util.isString(message.recipientAddress)))
                return "recipientAddress: buffer expected";
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                return "amount: integer|Long expected";
        return null;
    };

    /**
     * Creates a GenesisTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GenesisTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GenesisTransactionData} GenesisTransactionData
     */
    GenesisTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.GenesisTransactionData)
            return object;
        var message = new $root.GenesisTransactionData();
        if (object.recipientAddress != null)
            if (typeof object.recipientAddress === "string")
                $util.base64.decode(object.recipientAddress, message.recipientAddress = $util.newBuffer($util.base64.length(object.recipientAddress)), 0);
            else if (object.recipientAddress.length)
                message.recipientAddress = object.recipientAddress;
        if (object.amount != null)
            if ($util.Long)
                (message.amount = $util.Long.fromValue(object.amount)).unsigned = false;
            else if (typeof object.amount === "string")
                message.amount = parseInt(object.amount, 10);
            else if (typeof object.amount === "number")
                message.amount = object.amount;
            else if (typeof object.amount === "object")
                message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber();
        return message;
    };

    /**
     * Creates a plain object from a GenesisTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GenesisTransactionData
     * @static
     * @param {GenesisTransactionData} message GenesisTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GenesisTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.recipientAddress = "";
            else {
                object.recipientAddress = [];
                if (options.bytes !== Array)
                    object.recipientAddress = $util.newBuffer(object.recipientAddress);
            }
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.amount = options.longs === String ? "0" : 0;
        }
        if (message.recipientAddress != null && message.hasOwnProperty("recipientAddress"))
            object.recipientAddress = options.bytes === String ? $util.base64.encode(message.recipientAddress, 0, message.recipientAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.recipientAddress) : message.recipientAddress;
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (typeof message.amount === "number")
                object.amount = options.longs === String ? String(message.amount) : message.amount;
            else
                object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber() : message.amount;
        return object;
    };

    /**
     * Converts this GenesisTransactionData to JSON.
     * @function toJSON
     * @memberof GenesisTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GenesisTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GenesisTransactionData;
})();

$root.PaymentTransactionData = (function() {

    /**
     * Properties of a PaymentTransactionData.
     * @exports IPaymentTransactionData
     * @interface IPaymentTransactionData
     * @property {Uint8Array|null} [recipientAddress] PaymentTransactionData recipientAddress
     * @property {Long|null} [amount] PaymentTransactionData amount
     */

    /**
     * Constructs a new PaymentTransactionData.
     * @exports PaymentTransactionData
     * @classdesc Represents a PaymentTransactionData.
     * @implements IPaymentTransactionData
     * @constructor
     * @param {IPaymentTransactionData=} [properties] Properties to set
     */
    function PaymentTransactionData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PaymentTransactionData recipientAddress.
     * @member {Uint8Array} recipientAddress
     * @memberof PaymentTransactionData
     * @instance
     */
    PaymentTransactionData.prototype.recipientAddress = $util.newBuffer([]);

    /**
     * PaymentTransactionData amount.
     * @member {Long} amount
     * @memberof PaymentTransactionData
     * @instance
     */
    PaymentTransactionData.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Creates a new PaymentTransactionData instance using the specified properties.
     * @function create
     * @memberof PaymentTransactionData
     * @static
     * @param {IPaymentTransactionData=} [properties] Properties to set
     * @returns {PaymentTransactionData} PaymentTransactionData instance
     */
    PaymentTransactionData.create = function create(properties) {
        return new PaymentTransactionData(properties);
    };

    /**
     * Encodes the specified PaymentTransactionData message. Does not implicitly {@link PaymentTransactionData.verify|verify} messages.
     * @function encode
     * @memberof PaymentTransactionData
     * @static
     * @param {IPaymentTransactionData} message PaymentTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PaymentTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.recipientAddress != null && message.hasOwnProperty("recipientAddress"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.recipientAddress);
        if (message.amount != null && message.hasOwnProperty("amount"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.amount);
        return writer;
    };

    /**
     * Encodes the specified PaymentTransactionData message, length delimited. Does not implicitly {@link PaymentTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PaymentTransactionData
     * @static
     * @param {IPaymentTransactionData} message PaymentTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PaymentTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PaymentTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof PaymentTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PaymentTransactionData} PaymentTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PaymentTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PaymentTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.recipientAddress = reader.bytes();
                break;
            case 2:
                message.amount = reader.int64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PaymentTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PaymentTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PaymentTransactionData} PaymentTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PaymentTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PaymentTransactionData message.
     * @function verify
     * @memberof PaymentTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PaymentTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.recipientAddress != null && message.hasOwnProperty("recipientAddress"))
            if (!(message.recipientAddress && typeof message.recipientAddress.length === "number" || $util.isString(message.recipientAddress)))
                return "recipientAddress: buffer expected";
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                return "amount: integer|Long expected";
        return null;
    };

    /**
     * Creates a PaymentTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PaymentTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PaymentTransactionData} PaymentTransactionData
     */
    PaymentTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.PaymentTransactionData)
            return object;
        var message = new $root.PaymentTransactionData();
        if (object.recipientAddress != null)
            if (typeof object.recipientAddress === "string")
                $util.base64.decode(object.recipientAddress, message.recipientAddress = $util.newBuffer($util.base64.length(object.recipientAddress)), 0);
            else if (object.recipientAddress.length)
                message.recipientAddress = object.recipientAddress;
        if (object.amount != null)
            if ($util.Long)
                (message.amount = $util.Long.fromValue(object.amount)).unsigned = false;
            else if (typeof object.amount === "string")
                message.amount = parseInt(object.amount, 10);
            else if (typeof object.amount === "number")
                message.amount = object.amount;
            else if (typeof object.amount === "object")
                message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber();
        return message;
    };

    /**
     * Creates a plain object from a PaymentTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PaymentTransactionData
     * @static
     * @param {PaymentTransactionData} message PaymentTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PaymentTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.recipientAddress = "";
            else {
                object.recipientAddress = [];
                if (options.bytes !== Array)
                    object.recipientAddress = $util.newBuffer(object.recipientAddress);
            }
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.amount = options.longs === String ? "0" : 0;
        }
        if (message.recipientAddress != null && message.hasOwnProperty("recipientAddress"))
            object.recipientAddress = options.bytes === String ? $util.base64.encode(message.recipientAddress, 0, message.recipientAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.recipientAddress) : message.recipientAddress;
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (typeof message.amount === "number")
                object.amount = options.longs === String ? String(message.amount) : message.amount;
            else
                object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber() : message.amount;
        return object;
    };

    /**
     * Converts this PaymentTransactionData to JSON.
     * @function toJSON
     * @memberof PaymentTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PaymentTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PaymentTransactionData;
})();

$root.TransferTransactionData = (function() {

    /**
     * Properties of a TransferTransactionData.
     * @exports ITransferTransactionData
     * @interface ITransferTransactionData
     * @property {IRecipient|null} [recipient] TransferTransactionData recipient
     * @property {IAmount|null} [amount] TransferTransactionData amount
     * @property {Uint8Array|null} [attachment] TransferTransactionData attachment
     */

    /**
     * Constructs a new TransferTransactionData.
     * @exports TransferTransactionData
     * @classdesc Represents a TransferTransactionData.
     * @implements ITransferTransactionData
     * @constructor
     * @param {ITransferTransactionData=} [properties] Properties to set
     */
    function TransferTransactionData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TransferTransactionData recipient.
     * @member {IRecipient|null|undefined} recipient
     * @memberof TransferTransactionData
     * @instance
     */
    TransferTransactionData.prototype.recipient = null;

    /**
     * TransferTransactionData amount.
     * @member {IAmount|null|undefined} amount
     * @memberof TransferTransactionData
     * @instance
     */
    TransferTransactionData.prototype.amount = null;

    /**
     * TransferTransactionData attachment.
     * @member {Uint8Array} attachment
     * @memberof TransferTransactionData
     * @instance
     */
    TransferTransactionData.prototype.attachment = $util.newBuffer([]);

    /**
     * Creates a new TransferTransactionData instance using the specified properties.
     * @function create
     * @memberof TransferTransactionData
     * @static
     * @param {ITransferTransactionData=} [properties] Properties to set
     * @returns {TransferTransactionData} TransferTransactionData instance
     */
    TransferTransactionData.create = function create(properties) {
        return new TransferTransactionData(properties);
    };

    /**
     * Encodes the specified TransferTransactionData message. Does not implicitly {@link TransferTransactionData.verify|verify} messages.
     * @function encode
     * @memberof TransferTransactionData
     * @static
     * @param {ITransferTransactionData} message TransferTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TransferTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.recipient != null && message.hasOwnProperty("recipient"))
            $root.Recipient.encode(message.recipient, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.amount != null && message.hasOwnProperty("amount"))
            $root.Amount.encode(message.amount, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.attachment != null && message.hasOwnProperty("attachment"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.attachment);
        return writer;
    };

    /**
     * Encodes the specified TransferTransactionData message, length delimited. Does not implicitly {@link TransferTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TransferTransactionData
     * @static
     * @param {ITransferTransactionData} message TransferTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TransferTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TransferTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof TransferTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TransferTransactionData} TransferTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TransferTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TransferTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.recipient = $root.Recipient.decode(reader, reader.uint32());
                break;
            case 2:
                message.amount = $root.Amount.decode(reader, reader.uint32());
                break;
            case 3:
                message.attachment = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TransferTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TransferTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TransferTransactionData} TransferTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TransferTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TransferTransactionData message.
     * @function verify
     * @memberof TransferTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TransferTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.recipient != null && message.hasOwnProperty("recipient")) {
            var error = $root.Recipient.verify(message.recipient);
            if (error)
                return "recipient." + error;
        }
        if (message.amount != null && message.hasOwnProperty("amount")) {
            var error = $root.Amount.verify(message.amount);
            if (error)
                return "amount." + error;
        }
        if (message.attachment != null && message.hasOwnProperty("attachment"))
            if (!(message.attachment && typeof message.attachment.length === "number" || $util.isString(message.attachment)))
                return "attachment: buffer expected";
        return null;
    };

    /**
     * Creates a TransferTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TransferTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TransferTransactionData} TransferTransactionData
     */
    TransferTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.TransferTransactionData)
            return object;
        var message = new $root.TransferTransactionData();
        if (object.recipient != null) {
            if (typeof object.recipient !== "object")
                throw TypeError(".TransferTransactionData.recipient: object expected");
            message.recipient = $root.Recipient.fromObject(object.recipient);
        }
        if (object.amount != null) {
            if (typeof object.amount !== "object")
                throw TypeError(".TransferTransactionData.amount: object expected");
            message.amount = $root.Amount.fromObject(object.amount);
        }
        if (object.attachment != null)
            if (typeof object.attachment === "string")
                $util.base64.decode(object.attachment, message.attachment = $util.newBuffer($util.base64.length(object.attachment)), 0);
            else if (object.attachment.length)
                message.attachment = object.attachment;
        return message;
    };

    /**
     * Creates a plain object from a TransferTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TransferTransactionData
     * @static
     * @param {TransferTransactionData} message TransferTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TransferTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.recipient = null;
            object.amount = null;
            if (options.bytes === String)
                object.attachment = "";
            else {
                object.attachment = [];
                if (options.bytes !== Array)
                    object.attachment = $util.newBuffer(object.attachment);
            }
        }
        if (message.recipient != null && message.hasOwnProperty("recipient"))
            object.recipient = $root.Recipient.toObject(message.recipient, options);
        if (message.amount != null && message.hasOwnProperty("amount"))
            object.amount = $root.Amount.toObject(message.amount, options);
        if (message.attachment != null && message.hasOwnProperty("attachment"))
            object.attachment = options.bytes === String ? $util.base64.encode(message.attachment, 0, message.attachment.length) : options.bytes === Array ? Array.prototype.slice.call(message.attachment) : message.attachment;
        return object;
    };

    /**
     * Converts this TransferTransactionData to JSON.
     * @function toJSON
     * @memberof TransferTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TransferTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TransferTransactionData;
})();

$root.CreateAliasTransactionData = (function() {

    /**
     * Properties of a CreateAliasTransactionData.
     * @exports ICreateAliasTransactionData
     * @interface ICreateAliasTransactionData
     * @property {string|null} [alias] CreateAliasTransactionData alias
     */

    /**
     * Constructs a new CreateAliasTransactionData.
     * @exports CreateAliasTransactionData
     * @classdesc Represents a CreateAliasTransactionData.
     * @implements ICreateAliasTransactionData
     * @constructor
     * @param {ICreateAliasTransactionData=} [properties] Properties to set
     */
    function CreateAliasTransactionData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CreateAliasTransactionData alias.
     * @member {string} alias
     * @memberof CreateAliasTransactionData
     * @instance
     */
    CreateAliasTransactionData.prototype.alias = "";

    /**
     * Creates a new CreateAliasTransactionData instance using the specified properties.
     * @function create
     * @memberof CreateAliasTransactionData
     * @static
     * @param {ICreateAliasTransactionData=} [properties] Properties to set
     * @returns {CreateAliasTransactionData} CreateAliasTransactionData instance
     */
    CreateAliasTransactionData.create = function create(properties) {
        return new CreateAliasTransactionData(properties);
    };

    /**
     * Encodes the specified CreateAliasTransactionData message. Does not implicitly {@link CreateAliasTransactionData.verify|verify} messages.
     * @function encode
     * @memberof CreateAliasTransactionData
     * @static
     * @param {ICreateAliasTransactionData} message CreateAliasTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CreateAliasTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.alias != null && message.hasOwnProperty("alias"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.alias);
        return writer;
    };

    /**
     * Encodes the specified CreateAliasTransactionData message, length delimited. Does not implicitly {@link CreateAliasTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CreateAliasTransactionData
     * @static
     * @param {ICreateAliasTransactionData} message CreateAliasTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CreateAliasTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CreateAliasTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof CreateAliasTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CreateAliasTransactionData} CreateAliasTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CreateAliasTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CreateAliasTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.alias = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CreateAliasTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CreateAliasTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CreateAliasTransactionData} CreateAliasTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CreateAliasTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CreateAliasTransactionData message.
     * @function verify
     * @memberof CreateAliasTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CreateAliasTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.alias != null && message.hasOwnProperty("alias"))
            if (!$util.isString(message.alias))
                return "alias: string expected";
        return null;
    };

    /**
     * Creates a CreateAliasTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CreateAliasTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CreateAliasTransactionData} CreateAliasTransactionData
     */
    CreateAliasTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.CreateAliasTransactionData)
            return object;
        var message = new $root.CreateAliasTransactionData();
        if (object.alias != null)
            message.alias = String(object.alias);
        return message;
    };

    /**
     * Creates a plain object from a CreateAliasTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CreateAliasTransactionData
     * @static
     * @param {CreateAliasTransactionData} message CreateAliasTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CreateAliasTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.alias = "";
        if (message.alias != null && message.hasOwnProperty("alias"))
            object.alias = message.alias;
        return object;
    };

    /**
     * Converts this CreateAliasTransactionData to JSON.
     * @function toJSON
     * @memberof CreateAliasTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CreateAliasTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CreateAliasTransactionData;
})();

$root.DataTransactionData = (function() {

    /**
     * Properties of a DataTransactionData.
     * @exports IDataTransactionData
     * @interface IDataTransactionData
     * @property {Array.<DataTransactionData.IDataEntry>|null} [data] DataTransactionData data
     */

    /**
     * Constructs a new DataTransactionData.
     * @exports DataTransactionData
     * @classdesc Represents a DataTransactionData.
     * @implements IDataTransactionData
     * @constructor
     * @param {IDataTransactionData=} [properties] Properties to set
     */
    function DataTransactionData(properties) {
        this.data = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * DataTransactionData data.
     * @member {Array.<DataTransactionData.IDataEntry>} data
     * @memberof DataTransactionData
     * @instance
     */
    DataTransactionData.prototype.data = $util.emptyArray;

    /**
     * Creates a new DataTransactionData instance using the specified properties.
     * @function create
     * @memberof DataTransactionData
     * @static
     * @param {IDataTransactionData=} [properties] Properties to set
     * @returns {DataTransactionData} DataTransactionData instance
     */
    DataTransactionData.create = function create(properties) {
        return new DataTransactionData(properties);
    };

    /**
     * Encodes the specified DataTransactionData message. Does not implicitly {@link DataTransactionData.verify|verify} messages.
     * @function encode
     * @memberof DataTransactionData
     * @static
     * @param {IDataTransactionData} message DataTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DataTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.data != null && message.data.length)
            for (var i = 0; i < message.data.length; ++i)
                $root.DataTransactionData.DataEntry.encode(message.data[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified DataTransactionData message, length delimited. Does not implicitly {@link DataTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof DataTransactionData
     * @static
     * @param {IDataTransactionData} message DataTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DataTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DataTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof DataTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {DataTransactionData} DataTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DataTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DataTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.data && message.data.length))
                    message.data = [];
                message.data.push($root.DataTransactionData.DataEntry.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a DataTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof DataTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {DataTransactionData} DataTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DataTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DataTransactionData message.
     * @function verify
     * @memberof DataTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DataTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.data != null && message.hasOwnProperty("data")) {
            if (!Array.isArray(message.data))
                return "data: array expected";
            for (var i = 0; i < message.data.length; ++i) {
                var error = $root.DataTransactionData.DataEntry.verify(message.data[i]);
                if (error)
                    return "data." + error;
            }
        }
        return null;
    };

    /**
     * Creates a DataTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DataTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {DataTransactionData} DataTransactionData
     */
    DataTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.DataTransactionData)
            return object;
        var message = new $root.DataTransactionData();
        if (object.data) {
            if (!Array.isArray(object.data))
                throw TypeError(".DataTransactionData.data: array expected");
            message.data = [];
            for (var i = 0; i < object.data.length; ++i) {
                if (typeof object.data[i] !== "object")
                    throw TypeError(".DataTransactionData.data: object expected");
                message.data[i] = $root.DataTransactionData.DataEntry.fromObject(object.data[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a DataTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DataTransactionData
     * @static
     * @param {DataTransactionData} message DataTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DataTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.data = [];
        if (message.data && message.data.length) {
            object.data = [];
            for (var j = 0; j < message.data.length; ++j)
                object.data[j] = $root.DataTransactionData.DataEntry.toObject(message.data[j], options);
        }
        return object;
    };

    /**
     * Converts this DataTransactionData to JSON.
     * @function toJSON
     * @memberof DataTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DataTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    DataTransactionData.DataEntry = (function() {

        /**
         * Properties of a DataEntry.
         * @memberof DataTransactionData
         * @interface IDataEntry
         * @property {string|null} [key] DataEntry key
         * @property {Long|null} [intValue] DataEntry intValue
         * @property {boolean|null} [boolValue] DataEntry boolValue
         * @property {Uint8Array|null} [binaryValue] DataEntry binaryValue
         * @property {string|null} [stringValue] DataEntry stringValue
         */

        /**
         * Constructs a new DataEntry.
         * @memberof DataTransactionData
         * @classdesc Represents a DataEntry.
         * @implements IDataEntry
         * @constructor
         * @param {DataTransactionData.IDataEntry=} [properties] Properties to set
         */
        function DataEntry(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DataEntry key.
         * @member {string} key
         * @memberof DataTransactionData.DataEntry
         * @instance
         */
        DataEntry.prototype.key = "";

        /**
         * DataEntry intValue.
         * @member {Long} intValue
         * @memberof DataTransactionData.DataEntry
         * @instance
         */
        DataEntry.prototype.intValue = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * DataEntry boolValue.
         * @member {boolean} boolValue
         * @memberof DataTransactionData.DataEntry
         * @instance
         */
        DataEntry.prototype.boolValue = false;

        /**
         * DataEntry binaryValue.
         * @member {Uint8Array} binaryValue
         * @memberof DataTransactionData.DataEntry
         * @instance
         */
        DataEntry.prototype.binaryValue = $util.newBuffer([]);

        /**
         * DataEntry stringValue.
         * @member {string} stringValue
         * @memberof DataTransactionData.DataEntry
         * @instance
         */
        DataEntry.prototype.stringValue = "";

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * DataEntry value.
         * @member {"intValue"|"boolValue"|"binaryValue"|"stringValue"|undefined} value
         * @memberof DataTransactionData.DataEntry
         * @instance
         */
        Object.defineProperty(DataEntry.prototype, "value", {
            get: $util.oneOfGetter($oneOfFields = ["intValue", "boolValue", "binaryValue", "stringValue"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new DataEntry instance using the specified properties.
         * @function create
         * @memberof DataTransactionData.DataEntry
         * @static
         * @param {DataTransactionData.IDataEntry=} [properties] Properties to set
         * @returns {DataTransactionData.DataEntry} DataEntry instance
         */
        DataEntry.create = function create(properties) {
            return new DataEntry(properties);
        };

        /**
         * Encodes the specified DataEntry message. Does not implicitly {@link DataTransactionData.DataEntry.verify|verify} messages.
         * @function encode
         * @memberof DataTransactionData.DataEntry
         * @static
         * @param {DataTransactionData.IDataEntry} message DataEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DataEntry.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.key != null && message.hasOwnProperty("key"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.intValue != null && message.hasOwnProperty("intValue"))
                writer.uint32(/* id 10, wireType 0 =*/80).int64(message.intValue);
            if (message.boolValue != null && message.hasOwnProperty("boolValue"))
                writer.uint32(/* id 11, wireType 0 =*/88).bool(message.boolValue);
            if (message.binaryValue != null && message.hasOwnProperty("binaryValue"))
                writer.uint32(/* id 12, wireType 2 =*/98).bytes(message.binaryValue);
            if (message.stringValue != null && message.hasOwnProperty("stringValue"))
                writer.uint32(/* id 13, wireType 2 =*/106).string(message.stringValue);
            return writer;
        };

        /**
         * Encodes the specified DataEntry message, length delimited. Does not implicitly {@link DataTransactionData.DataEntry.verify|verify} messages.
         * @function encodeDelimited
         * @memberof DataTransactionData.DataEntry
         * @static
         * @param {DataTransactionData.IDataEntry} message DataEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DataEntry.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DataEntry message from the specified reader or buffer.
         * @function decode
         * @memberof DataTransactionData.DataEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {DataTransactionData.DataEntry} DataEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DataEntry.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DataTransactionData.DataEntry();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 10:
                    message.intValue = reader.int64();
                    break;
                case 11:
                    message.boolValue = reader.bool();
                    break;
                case 12:
                    message.binaryValue = reader.bytes();
                    break;
                case 13:
                    message.stringValue = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DataEntry message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof DataTransactionData.DataEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {DataTransactionData.DataEntry} DataEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DataEntry.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DataEntry message.
         * @function verify
         * @memberof DataTransactionData.DataEntry
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DataEntry.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.key != null && message.hasOwnProperty("key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.intValue != null && message.hasOwnProperty("intValue")) {
                properties.value = 1;
                if (!$util.isInteger(message.intValue) && !(message.intValue && $util.isInteger(message.intValue.low) && $util.isInteger(message.intValue.high)))
                    return "intValue: integer|Long expected";
            }
            if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (typeof message.boolValue !== "boolean")
                    return "boolValue: boolean expected";
            }
            if (message.binaryValue != null && message.hasOwnProperty("binaryValue")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (!(message.binaryValue && typeof message.binaryValue.length === "number" || $util.isString(message.binaryValue)))
                    return "binaryValue: buffer expected";
            }
            if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (!$util.isString(message.stringValue))
                    return "stringValue: string expected";
            }
            return null;
        };

        /**
         * Creates a DataEntry message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof DataTransactionData.DataEntry
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {DataTransactionData.DataEntry} DataEntry
         */
        DataEntry.fromObject = function fromObject(object) {
            if (object instanceof $root.DataTransactionData.DataEntry)
                return object;
            var message = new $root.DataTransactionData.DataEntry();
            if (object.key != null)
                message.key = String(object.key);
            if (object.intValue != null)
                if ($util.Long)
                    (message.intValue = $util.Long.fromValue(object.intValue)).unsigned = false;
                else if (typeof object.intValue === "string")
                    message.intValue = parseInt(object.intValue, 10);
                else if (typeof object.intValue === "number")
                    message.intValue = object.intValue;
                else if (typeof object.intValue === "object")
                    message.intValue = new $util.LongBits(object.intValue.low >>> 0, object.intValue.high >>> 0).toNumber();
            if (object.boolValue != null)
                message.boolValue = Boolean(object.boolValue);
            if (object.binaryValue != null)
                if (typeof object.binaryValue === "string")
                    $util.base64.decode(object.binaryValue, message.binaryValue = $util.newBuffer($util.base64.length(object.binaryValue)), 0);
                else if (object.binaryValue.length)
                    message.binaryValue = object.binaryValue;
            if (object.stringValue != null)
                message.stringValue = String(object.stringValue);
            return message;
        };

        /**
         * Creates a plain object from a DataEntry message. Also converts values to other types if specified.
         * @function toObject
         * @memberof DataTransactionData.DataEntry
         * @static
         * @param {DataTransactionData.DataEntry} message DataEntry
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DataEntry.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.key = "";
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = message.key;
            if (message.intValue != null && message.hasOwnProperty("intValue")) {
                if (typeof message.intValue === "number")
                    object.intValue = options.longs === String ? String(message.intValue) : message.intValue;
                else
                    object.intValue = options.longs === String ? $util.Long.prototype.toString.call(message.intValue) : options.longs === Number ? new $util.LongBits(message.intValue.low >>> 0, message.intValue.high >>> 0).toNumber() : message.intValue;
                if (options.oneofs)
                    object.value = "intValue";
            }
            if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
                object.boolValue = message.boolValue;
                if (options.oneofs)
                    object.value = "boolValue";
            }
            if (message.binaryValue != null && message.hasOwnProperty("binaryValue")) {
                object.binaryValue = options.bytes === String ? $util.base64.encode(message.binaryValue, 0, message.binaryValue.length) : options.bytes === Array ? Array.prototype.slice.call(message.binaryValue) : message.binaryValue;
                if (options.oneofs)
                    object.value = "binaryValue";
            }
            if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                object.stringValue = message.stringValue;
                if (options.oneofs)
                    object.value = "stringValue";
            }
            return object;
        };

        /**
         * Converts this DataEntry to JSON.
         * @function toJSON
         * @memberof DataTransactionData.DataEntry
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DataEntry.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DataEntry;
    })();

    return DataTransactionData;
})();

$root.MassTransferTransactionData = (function() {

    /**
     * Properties of a MassTransferTransactionData.
     * @exports IMassTransferTransactionData
     * @interface IMassTransferTransactionData
     * @property {IAssetId|null} [assetId] MassTransferTransactionData assetId
     * @property {Array.<MassTransferTransactionData.ITransfer>|null} [transfers] MassTransferTransactionData transfers
     * @property {Uint8Array|null} [attachment] MassTransferTransactionData attachment
     */

    /**
     * Constructs a new MassTransferTransactionData.
     * @exports MassTransferTransactionData
     * @classdesc Represents a MassTransferTransactionData.
     * @implements IMassTransferTransactionData
     * @constructor
     * @param {IMassTransferTransactionData=} [properties] Properties to set
     */
    function MassTransferTransactionData(properties) {
        this.transfers = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MassTransferTransactionData assetId.
     * @member {IAssetId|null|undefined} assetId
     * @memberof MassTransferTransactionData
     * @instance
     */
    MassTransferTransactionData.prototype.assetId = null;

    /**
     * MassTransferTransactionData transfers.
     * @member {Array.<MassTransferTransactionData.ITransfer>} transfers
     * @memberof MassTransferTransactionData
     * @instance
     */
    MassTransferTransactionData.prototype.transfers = $util.emptyArray;

    /**
     * MassTransferTransactionData attachment.
     * @member {Uint8Array} attachment
     * @memberof MassTransferTransactionData
     * @instance
     */
    MassTransferTransactionData.prototype.attachment = $util.newBuffer([]);

    /**
     * Creates a new MassTransferTransactionData instance using the specified properties.
     * @function create
     * @memberof MassTransferTransactionData
     * @static
     * @param {IMassTransferTransactionData=} [properties] Properties to set
     * @returns {MassTransferTransactionData} MassTransferTransactionData instance
     */
    MassTransferTransactionData.create = function create(properties) {
        return new MassTransferTransactionData(properties);
    };

    /**
     * Encodes the specified MassTransferTransactionData message. Does not implicitly {@link MassTransferTransactionData.verify|verify} messages.
     * @function encode
     * @memberof MassTransferTransactionData
     * @static
     * @param {IMassTransferTransactionData} message MassTransferTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MassTransferTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.assetId != null && message.hasOwnProperty("assetId"))
            $root.AssetId.encode(message.assetId, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.transfers != null && message.transfers.length)
            for (var i = 0; i < message.transfers.length; ++i)
                $root.MassTransferTransactionData.Transfer.encode(message.transfers[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.attachment != null && message.hasOwnProperty("attachment"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.attachment);
        return writer;
    };

    /**
     * Encodes the specified MassTransferTransactionData message, length delimited. Does not implicitly {@link MassTransferTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MassTransferTransactionData
     * @static
     * @param {IMassTransferTransactionData} message MassTransferTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MassTransferTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MassTransferTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof MassTransferTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MassTransferTransactionData} MassTransferTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MassTransferTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MassTransferTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.assetId = $root.AssetId.decode(reader, reader.uint32());
                break;
            case 2:
                if (!(message.transfers && message.transfers.length))
                    message.transfers = [];
                message.transfers.push($root.MassTransferTransactionData.Transfer.decode(reader, reader.uint32()));
                break;
            case 3:
                message.attachment = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a MassTransferTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MassTransferTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MassTransferTransactionData} MassTransferTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MassTransferTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MassTransferTransactionData message.
     * @function verify
     * @memberof MassTransferTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MassTransferTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.assetId != null && message.hasOwnProperty("assetId")) {
            var error = $root.AssetId.verify(message.assetId);
            if (error)
                return "assetId." + error;
        }
        if (message.transfers != null && message.hasOwnProperty("transfers")) {
            if (!Array.isArray(message.transfers))
                return "transfers: array expected";
            for (var i = 0; i < message.transfers.length; ++i) {
                var error = $root.MassTransferTransactionData.Transfer.verify(message.transfers[i]);
                if (error)
                    return "transfers." + error;
            }
        }
        if (message.attachment != null && message.hasOwnProperty("attachment"))
            if (!(message.attachment && typeof message.attachment.length === "number" || $util.isString(message.attachment)))
                return "attachment: buffer expected";
        return null;
    };

    /**
     * Creates a MassTransferTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MassTransferTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MassTransferTransactionData} MassTransferTransactionData
     */
    MassTransferTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.MassTransferTransactionData)
            return object;
        var message = new $root.MassTransferTransactionData();
        if (object.assetId != null) {
            if (typeof object.assetId !== "object")
                throw TypeError(".MassTransferTransactionData.assetId: object expected");
            message.assetId = $root.AssetId.fromObject(object.assetId);
        }
        if (object.transfers) {
            if (!Array.isArray(object.transfers))
                throw TypeError(".MassTransferTransactionData.transfers: array expected");
            message.transfers = [];
            for (var i = 0; i < object.transfers.length; ++i) {
                if (typeof object.transfers[i] !== "object")
                    throw TypeError(".MassTransferTransactionData.transfers: object expected");
                message.transfers[i] = $root.MassTransferTransactionData.Transfer.fromObject(object.transfers[i]);
            }
        }
        if (object.attachment != null)
            if (typeof object.attachment === "string")
                $util.base64.decode(object.attachment, message.attachment = $util.newBuffer($util.base64.length(object.attachment)), 0);
            else if (object.attachment.length)
                message.attachment = object.attachment;
        return message;
    };

    /**
     * Creates a plain object from a MassTransferTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MassTransferTransactionData
     * @static
     * @param {MassTransferTransactionData} message MassTransferTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MassTransferTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.transfers = [];
        if (options.defaults) {
            object.assetId = null;
            if (options.bytes === String)
                object.attachment = "";
            else {
                object.attachment = [];
                if (options.bytes !== Array)
                    object.attachment = $util.newBuffer(object.attachment);
            }
        }
        if (message.assetId != null && message.hasOwnProperty("assetId"))
            object.assetId = $root.AssetId.toObject(message.assetId, options);
        if (message.transfers && message.transfers.length) {
            object.transfers = [];
            for (var j = 0; j < message.transfers.length; ++j)
                object.transfers[j] = $root.MassTransferTransactionData.Transfer.toObject(message.transfers[j], options);
        }
        if (message.attachment != null && message.hasOwnProperty("attachment"))
            object.attachment = options.bytes === String ? $util.base64.encode(message.attachment, 0, message.attachment.length) : options.bytes === Array ? Array.prototype.slice.call(message.attachment) : message.attachment;
        return object;
    };

    /**
     * Converts this MassTransferTransactionData to JSON.
     * @function toJSON
     * @memberof MassTransferTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MassTransferTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    MassTransferTransactionData.Transfer = (function() {

        /**
         * Properties of a Transfer.
         * @memberof MassTransferTransactionData
         * @interface ITransfer
         * @property {IRecipient|null} [address] Transfer address
         * @property {Long|null} [amount] Transfer amount
         */

        /**
         * Constructs a new Transfer.
         * @memberof MassTransferTransactionData
         * @classdesc Represents a Transfer.
         * @implements ITransfer
         * @constructor
         * @param {MassTransferTransactionData.ITransfer=} [properties] Properties to set
         */
        function Transfer(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Transfer address.
         * @member {IRecipient|null|undefined} address
         * @memberof MassTransferTransactionData.Transfer
         * @instance
         */
        Transfer.prototype.address = null;

        /**
         * Transfer amount.
         * @member {Long} amount
         * @memberof MassTransferTransactionData.Transfer
         * @instance
         */
        Transfer.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new Transfer instance using the specified properties.
         * @function create
         * @memberof MassTransferTransactionData.Transfer
         * @static
         * @param {MassTransferTransactionData.ITransfer=} [properties] Properties to set
         * @returns {MassTransferTransactionData.Transfer} Transfer instance
         */
        Transfer.create = function create(properties) {
            return new Transfer(properties);
        };

        /**
         * Encodes the specified Transfer message. Does not implicitly {@link MassTransferTransactionData.Transfer.verify|verify} messages.
         * @function encode
         * @memberof MassTransferTransactionData.Transfer
         * @static
         * @param {MassTransferTransactionData.ITransfer} message Transfer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Transfer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.address != null && message.hasOwnProperty("address"))
                $root.Recipient.encode(message.address, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.amount != null && message.hasOwnProperty("amount"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.amount);
            return writer;
        };

        /**
         * Encodes the specified Transfer message, length delimited. Does not implicitly {@link MassTransferTransactionData.Transfer.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MassTransferTransactionData.Transfer
         * @static
         * @param {MassTransferTransactionData.ITransfer} message Transfer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Transfer.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Transfer message from the specified reader or buffer.
         * @function decode
         * @memberof MassTransferTransactionData.Transfer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MassTransferTransactionData.Transfer} Transfer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Transfer.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MassTransferTransactionData.Transfer();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.address = $root.Recipient.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.amount = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Transfer message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MassTransferTransactionData.Transfer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MassTransferTransactionData.Transfer} Transfer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Transfer.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Transfer message.
         * @function verify
         * @memberof MassTransferTransactionData.Transfer
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Transfer.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.address != null && message.hasOwnProperty("address")) {
                var error = $root.Recipient.verify(message.address);
                if (error)
                    return "address." + error;
            }
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                    return "amount: integer|Long expected";
            return null;
        };

        /**
         * Creates a Transfer message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MassTransferTransactionData.Transfer
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MassTransferTransactionData.Transfer} Transfer
         */
        Transfer.fromObject = function fromObject(object) {
            if (object instanceof $root.MassTransferTransactionData.Transfer)
                return object;
            var message = new $root.MassTransferTransactionData.Transfer();
            if (object.address != null) {
                if (typeof object.address !== "object")
                    throw TypeError(".MassTransferTransactionData.Transfer.address: object expected");
                message.address = $root.Recipient.fromObject(object.address);
            }
            if (object.amount != null)
                if ($util.Long)
                    (message.amount = $util.Long.fromValue(object.amount)).unsigned = false;
                else if (typeof object.amount === "string")
                    message.amount = parseInt(object.amount, 10);
                else if (typeof object.amount === "number")
                    message.amount = object.amount;
                else if (typeof object.amount === "object")
                    message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a Transfer message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MassTransferTransactionData.Transfer
         * @static
         * @param {MassTransferTransactionData.Transfer} message Transfer
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Transfer.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.address = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.amount = options.longs === String ? "0" : 0;
            }
            if (message.address != null && message.hasOwnProperty("address"))
                object.address = $root.Recipient.toObject(message.address, options);
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (typeof message.amount === "number")
                    object.amount = options.longs === String ? String(message.amount) : message.amount;
                else
                    object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber() : message.amount;
            return object;
        };

        /**
         * Converts this Transfer to JSON.
         * @function toJSON
         * @memberof MassTransferTransactionData.Transfer
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Transfer.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Transfer;
    })();

    return MassTransferTransactionData;
})();

$root.LeaseTransactionData = (function() {

    /**
     * Properties of a LeaseTransactionData.
     * @exports ILeaseTransactionData
     * @interface ILeaseTransactionData
     * @property {IRecipient|null} [recipient] LeaseTransactionData recipient
     * @property {Long|null} [amount] LeaseTransactionData amount
     */

    /**
     * Constructs a new LeaseTransactionData.
     * @exports LeaseTransactionData
     * @classdesc Represents a LeaseTransactionData.
     * @implements ILeaseTransactionData
     * @constructor
     * @param {ILeaseTransactionData=} [properties] Properties to set
     */
    function LeaseTransactionData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LeaseTransactionData recipient.
     * @member {IRecipient|null|undefined} recipient
     * @memberof LeaseTransactionData
     * @instance
     */
    LeaseTransactionData.prototype.recipient = null;

    /**
     * LeaseTransactionData amount.
     * @member {Long} amount
     * @memberof LeaseTransactionData
     * @instance
     */
    LeaseTransactionData.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Creates a new LeaseTransactionData instance using the specified properties.
     * @function create
     * @memberof LeaseTransactionData
     * @static
     * @param {ILeaseTransactionData=} [properties] Properties to set
     * @returns {LeaseTransactionData} LeaseTransactionData instance
     */
    LeaseTransactionData.create = function create(properties) {
        return new LeaseTransactionData(properties);
    };

    /**
     * Encodes the specified LeaseTransactionData message. Does not implicitly {@link LeaseTransactionData.verify|verify} messages.
     * @function encode
     * @memberof LeaseTransactionData
     * @static
     * @param {ILeaseTransactionData} message LeaseTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LeaseTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.recipient != null && message.hasOwnProperty("recipient"))
            $root.Recipient.encode(message.recipient, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.amount != null && message.hasOwnProperty("amount"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.amount);
        return writer;
    };

    /**
     * Encodes the specified LeaseTransactionData message, length delimited. Does not implicitly {@link LeaseTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LeaseTransactionData
     * @static
     * @param {ILeaseTransactionData} message LeaseTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LeaseTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LeaseTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof LeaseTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LeaseTransactionData} LeaseTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LeaseTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LeaseTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.recipient = $root.Recipient.decode(reader, reader.uint32());
                break;
            case 2:
                message.amount = reader.int64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a LeaseTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LeaseTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LeaseTransactionData} LeaseTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LeaseTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LeaseTransactionData message.
     * @function verify
     * @memberof LeaseTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LeaseTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.recipient != null && message.hasOwnProperty("recipient")) {
            var error = $root.Recipient.verify(message.recipient);
            if (error)
                return "recipient." + error;
        }
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                return "amount: integer|Long expected";
        return null;
    };

    /**
     * Creates a LeaseTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LeaseTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LeaseTransactionData} LeaseTransactionData
     */
    LeaseTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.LeaseTransactionData)
            return object;
        var message = new $root.LeaseTransactionData();
        if (object.recipient != null) {
            if (typeof object.recipient !== "object")
                throw TypeError(".LeaseTransactionData.recipient: object expected");
            message.recipient = $root.Recipient.fromObject(object.recipient);
        }
        if (object.amount != null)
            if ($util.Long)
                (message.amount = $util.Long.fromValue(object.amount)).unsigned = false;
            else if (typeof object.amount === "string")
                message.amount = parseInt(object.amount, 10);
            else if (typeof object.amount === "number")
                message.amount = object.amount;
            else if (typeof object.amount === "object")
                message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber();
        return message;
    };

    /**
     * Creates a plain object from a LeaseTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LeaseTransactionData
     * @static
     * @param {LeaseTransactionData} message LeaseTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LeaseTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.recipient = null;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.amount = options.longs === String ? "0" : 0;
        }
        if (message.recipient != null && message.hasOwnProperty("recipient"))
            object.recipient = $root.Recipient.toObject(message.recipient, options);
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (typeof message.amount === "number")
                object.amount = options.longs === String ? String(message.amount) : message.amount;
            else
                object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber() : message.amount;
        return object;
    };

    /**
     * Converts this LeaseTransactionData to JSON.
     * @function toJSON
     * @memberof LeaseTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LeaseTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LeaseTransactionData;
})();

$root.LeaseCancelTransactionData = (function() {

    /**
     * Properties of a LeaseCancelTransactionData.
     * @exports ILeaseCancelTransactionData
     * @interface ILeaseCancelTransactionData
     * @property {Uint8Array|null} [leaseId] LeaseCancelTransactionData leaseId
     */

    /**
     * Constructs a new LeaseCancelTransactionData.
     * @exports LeaseCancelTransactionData
     * @classdesc Represents a LeaseCancelTransactionData.
     * @implements ILeaseCancelTransactionData
     * @constructor
     * @param {ILeaseCancelTransactionData=} [properties] Properties to set
     */
    function LeaseCancelTransactionData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LeaseCancelTransactionData leaseId.
     * @member {Uint8Array} leaseId
     * @memberof LeaseCancelTransactionData
     * @instance
     */
    LeaseCancelTransactionData.prototype.leaseId = $util.newBuffer([]);

    /**
     * Creates a new LeaseCancelTransactionData instance using the specified properties.
     * @function create
     * @memberof LeaseCancelTransactionData
     * @static
     * @param {ILeaseCancelTransactionData=} [properties] Properties to set
     * @returns {LeaseCancelTransactionData} LeaseCancelTransactionData instance
     */
    LeaseCancelTransactionData.create = function create(properties) {
        return new LeaseCancelTransactionData(properties);
    };

    /**
     * Encodes the specified LeaseCancelTransactionData message. Does not implicitly {@link LeaseCancelTransactionData.verify|verify} messages.
     * @function encode
     * @memberof LeaseCancelTransactionData
     * @static
     * @param {ILeaseCancelTransactionData} message LeaseCancelTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LeaseCancelTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.leaseId != null && message.hasOwnProperty("leaseId"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.leaseId);
        return writer;
    };

    /**
     * Encodes the specified LeaseCancelTransactionData message, length delimited. Does not implicitly {@link LeaseCancelTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LeaseCancelTransactionData
     * @static
     * @param {ILeaseCancelTransactionData} message LeaseCancelTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LeaseCancelTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LeaseCancelTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof LeaseCancelTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LeaseCancelTransactionData} LeaseCancelTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LeaseCancelTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LeaseCancelTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.leaseId = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a LeaseCancelTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LeaseCancelTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LeaseCancelTransactionData} LeaseCancelTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LeaseCancelTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LeaseCancelTransactionData message.
     * @function verify
     * @memberof LeaseCancelTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LeaseCancelTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.leaseId != null && message.hasOwnProperty("leaseId"))
            if (!(message.leaseId && typeof message.leaseId.length === "number" || $util.isString(message.leaseId)))
                return "leaseId: buffer expected";
        return null;
    };

    /**
     * Creates a LeaseCancelTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LeaseCancelTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LeaseCancelTransactionData} LeaseCancelTransactionData
     */
    LeaseCancelTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.LeaseCancelTransactionData)
            return object;
        var message = new $root.LeaseCancelTransactionData();
        if (object.leaseId != null)
            if (typeof object.leaseId === "string")
                $util.base64.decode(object.leaseId, message.leaseId = $util.newBuffer($util.base64.length(object.leaseId)), 0);
            else if (object.leaseId.length)
                message.leaseId = object.leaseId;
        return message;
    };

    /**
     * Creates a plain object from a LeaseCancelTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LeaseCancelTransactionData
     * @static
     * @param {LeaseCancelTransactionData} message LeaseCancelTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LeaseCancelTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            if (options.bytes === String)
                object.leaseId = "";
            else {
                object.leaseId = [];
                if (options.bytes !== Array)
                    object.leaseId = $util.newBuffer(object.leaseId);
            }
        if (message.leaseId != null && message.hasOwnProperty("leaseId"))
            object.leaseId = options.bytes === String ? $util.base64.encode(message.leaseId, 0, message.leaseId.length) : options.bytes === Array ? Array.prototype.slice.call(message.leaseId) : message.leaseId;
        return object;
    };

    /**
     * Converts this LeaseCancelTransactionData to JSON.
     * @function toJSON
     * @memberof LeaseCancelTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LeaseCancelTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LeaseCancelTransactionData;
})();

$root.BurnTransactionData = (function() {

    /**
     * Properties of a BurnTransactionData.
     * @exports IBurnTransactionData
     * @interface IBurnTransactionData
     * @property {IAssetAmount|null} [assetAmount] BurnTransactionData assetAmount
     */

    /**
     * Constructs a new BurnTransactionData.
     * @exports BurnTransactionData
     * @classdesc Represents a BurnTransactionData.
     * @implements IBurnTransactionData
     * @constructor
     * @param {IBurnTransactionData=} [properties] Properties to set
     */
    function BurnTransactionData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BurnTransactionData assetAmount.
     * @member {IAssetAmount|null|undefined} assetAmount
     * @memberof BurnTransactionData
     * @instance
     */
    BurnTransactionData.prototype.assetAmount = null;

    /**
     * Creates a new BurnTransactionData instance using the specified properties.
     * @function create
     * @memberof BurnTransactionData
     * @static
     * @param {IBurnTransactionData=} [properties] Properties to set
     * @returns {BurnTransactionData} BurnTransactionData instance
     */
    BurnTransactionData.create = function create(properties) {
        return new BurnTransactionData(properties);
    };

    /**
     * Encodes the specified BurnTransactionData message. Does not implicitly {@link BurnTransactionData.verify|verify} messages.
     * @function encode
     * @memberof BurnTransactionData
     * @static
     * @param {IBurnTransactionData} message BurnTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BurnTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.assetAmount != null && message.hasOwnProperty("assetAmount"))
            $root.AssetAmount.encode(message.assetAmount, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified BurnTransactionData message, length delimited. Does not implicitly {@link BurnTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BurnTransactionData
     * @static
     * @param {IBurnTransactionData} message BurnTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BurnTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BurnTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof BurnTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BurnTransactionData} BurnTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BurnTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BurnTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.assetAmount = $root.AssetAmount.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a BurnTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BurnTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BurnTransactionData} BurnTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BurnTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BurnTransactionData message.
     * @function verify
     * @memberof BurnTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BurnTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.assetAmount != null && message.hasOwnProperty("assetAmount")) {
            var error = $root.AssetAmount.verify(message.assetAmount);
            if (error)
                return "assetAmount." + error;
        }
        return null;
    };

    /**
     * Creates a BurnTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BurnTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BurnTransactionData} BurnTransactionData
     */
    BurnTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.BurnTransactionData)
            return object;
        var message = new $root.BurnTransactionData();
        if (object.assetAmount != null) {
            if (typeof object.assetAmount !== "object")
                throw TypeError(".BurnTransactionData.assetAmount: object expected");
            message.assetAmount = $root.AssetAmount.fromObject(object.assetAmount);
        }
        return message;
    };

    /**
     * Creates a plain object from a BurnTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BurnTransactionData
     * @static
     * @param {BurnTransactionData} message BurnTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BurnTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.assetAmount = null;
        if (message.assetAmount != null && message.hasOwnProperty("assetAmount"))
            object.assetAmount = $root.AssetAmount.toObject(message.assetAmount, options);
        return object;
    };

    /**
     * Converts this BurnTransactionData to JSON.
     * @function toJSON
     * @memberof BurnTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BurnTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BurnTransactionData;
})();

$root.IssueTransactionData = (function() {

    /**
     * Properties of an IssueTransactionData.
     * @exports IIssueTransactionData
     * @interface IIssueTransactionData
     * @property {Uint8Array|null} [name] IssueTransactionData name
     * @property {Uint8Array|null} [description] IssueTransactionData description
     * @property {Long|null} [amount] IssueTransactionData amount
     * @property {number|null} [decimals] IssueTransactionData decimals
     * @property {boolean|null} [reissuable] IssueTransactionData reissuable
     * @property {IScript|null} [script] IssueTransactionData script
     */

    /**
     * Constructs a new IssueTransactionData.
     * @exports IssueTransactionData
     * @classdesc Represents an IssueTransactionData.
     * @implements IIssueTransactionData
     * @constructor
     * @param {IIssueTransactionData=} [properties] Properties to set
     */
    function IssueTransactionData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * IssueTransactionData name.
     * @member {Uint8Array} name
     * @memberof IssueTransactionData
     * @instance
     */
    IssueTransactionData.prototype.name = $util.newBuffer([]);

    /**
     * IssueTransactionData description.
     * @member {Uint8Array} description
     * @memberof IssueTransactionData
     * @instance
     */
    IssueTransactionData.prototype.description = $util.newBuffer([]);

    /**
     * IssueTransactionData amount.
     * @member {Long} amount
     * @memberof IssueTransactionData
     * @instance
     */
    IssueTransactionData.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * IssueTransactionData decimals.
     * @member {number} decimals
     * @memberof IssueTransactionData
     * @instance
     */
    IssueTransactionData.prototype.decimals = 0;

    /**
     * IssueTransactionData reissuable.
     * @member {boolean} reissuable
     * @memberof IssueTransactionData
     * @instance
     */
    IssueTransactionData.prototype.reissuable = false;

    /**
     * IssueTransactionData script.
     * @member {IScript|null|undefined} script
     * @memberof IssueTransactionData
     * @instance
     */
    IssueTransactionData.prototype.script = null;

    /**
     * Creates a new IssueTransactionData instance using the specified properties.
     * @function create
     * @memberof IssueTransactionData
     * @static
     * @param {IIssueTransactionData=} [properties] Properties to set
     * @returns {IssueTransactionData} IssueTransactionData instance
     */
    IssueTransactionData.create = function create(properties) {
        return new IssueTransactionData(properties);
    };

    /**
     * Encodes the specified IssueTransactionData message. Does not implicitly {@link IssueTransactionData.verify|verify} messages.
     * @function encode
     * @memberof IssueTransactionData
     * @static
     * @param {IIssueTransactionData} message IssueTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    IssueTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && message.hasOwnProperty("name"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.name);
        if (message.description != null && message.hasOwnProperty("description"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.description);
        if (message.amount != null && message.hasOwnProperty("amount"))
            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.amount);
        if (message.decimals != null && message.hasOwnProperty("decimals"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.decimals);
        if (message.reissuable != null && message.hasOwnProperty("reissuable"))
            writer.uint32(/* id 5, wireType 0 =*/40).bool(message.reissuable);
        if (message.script != null && message.hasOwnProperty("script"))
            $root.Script.encode(message.script, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified IssueTransactionData message, length delimited. Does not implicitly {@link IssueTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof IssueTransactionData
     * @static
     * @param {IIssueTransactionData} message IssueTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    IssueTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an IssueTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof IssueTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {IssueTransactionData} IssueTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    IssueTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.IssueTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.bytes();
                break;
            case 2:
                message.description = reader.bytes();
                break;
            case 3:
                message.amount = reader.int64();
                break;
            case 4:
                message.decimals = reader.int32();
                break;
            case 5:
                message.reissuable = reader.bool();
                break;
            case 6:
                message.script = $root.Script.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an IssueTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof IssueTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {IssueTransactionData} IssueTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    IssueTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an IssueTransactionData message.
     * @function verify
     * @memberof IssueTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    IssueTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!(message.name && typeof message.name.length === "number" || $util.isString(message.name)))
                return "name: buffer expected";
        if (message.description != null && message.hasOwnProperty("description"))
            if (!(message.description && typeof message.description.length === "number" || $util.isString(message.description)))
                return "description: buffer expected";
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                return "amount: integer|Long expected";
        if (message.decimals != null && message.hasOwnProperty("decimals"))
            if (!$util.isInteger(message.decimals))
                return "decimals: integer expected";
        if (message.reissuable != null && message.hasOwnProperty("reissuable"))
            if (typeof message.reissuable !== "boolean")
                return "reissuable: boolean expected";
        if (message.script != null && message.hasOwnProperty("script")) {
            var error = $root.Script.verify(message.script);
            if (error)
                return "script." + error;
        }
        return null;
    };

    /**
     * Creates an IssueTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof IssueTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {IssueTransactionData} IssueTransactionData
     */
    IssueTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.IssueTransactionData)
            return object;
        var message = new $root.IssueTransactionData();
        if (object.name != null)
            if (typeof object.name === "string")
                $util.base64.decode(object.name, message.name = $util.newBuffer($util.base64.length(object.name)), 0);
            else if (object.name.length)
                message.name = object.name;
        if (object.description != null)
            if (typeof object.description === "string")
                $util.base64.decode(object.description, message.description = $util.newBuffer($util.base64.length(object.description)), 0);
            else if (object.description.length)
                message.description = object.description;
        if (object.amount != null)
            if ($util.Long)
                (message.amount = $util.Long.fromValue(object.amount)).unsigned = false;
            else if (typeof object.amount === "string")
                message.amount = parseInt(object.amount, 10);
            else if (typeof object.amount === "number")
                message.amount = object.amount;
            else if (typeof object.amount === "object")
                message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber();
        if (object.decimals != null)
            message.decimals = object.decimals | 0;
        if (object.reissuable != null)
            message.reissuable = Boolean(object.reissuable);
        if (object.script != null) {
            if (typeof object.script !== "object")
                throw TypeError(".IssueTransactionData.script: object expected");
            message.script = $root.Script.fromObject(object.script);
        }
        return message;
    };

    /**
     * Creates a plain object from an IssueTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof IssueTransactionData
     * @static
     * @param {IssueTransactionData} message IssueTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    IssueTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.name = "";
            else {
                object.name = [];
                if (options.bytes !== Array)
                    object.name = $util.newBuffer(object.name);
            }
            if (options.bytes === String)
                object.description = "";
            else {
                object.description = [];
                if (options.bytes !== Array)
                    object.description = $util.newBuffer(object.description);
            }
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.amount = options.longs === String ? "0" : 0;
            object.decimals = 0;
            object.reissuable = false;
            object.script = null;
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = options.bytes === String ? $util.base64.encode(message.name, 0, message.name.length) : options.bytes === Array ? Array.prototype.slice.call(message.name) : message.name;
        if (message.description != null && message.hasOwnProperty("description"))
            object.description = options.bytes === String ? $util.base64.encode(message.description, 0, message.description.length) : options.bytes === Array ? Array.prototype.slice.call(message.description) : message.description;
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (typeof message.amount === "number")
                object.amount = options.longs === String ? String(message.amount) : message.amount;
            else
                object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber() : message.amount;
        if (message.decimals != null && message.hasOwnProperty("decimals"))
            object.decimals = message.decimals;
        if (message.reissuable != null && message.hasOwnProperty("reissuable"))
            object.reissuable = message.reissuable;
        if (message.script != null && message.hasOwnProperty("script"))
            object.script = $root.Script.toObject(message.script, options);
        return object;
    };

    /**
     * Converts this IssueTransactionData to JSON.
     * @function toJSON
     * @memberof IssueTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    IssueTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return IssueTransactionData;
})();

$root.ReissueTransactionData = (function() {

    /**
     * Properties of a ReissueTransactionData.
     * @exports IReissueTransactionData
     * @interface IReissueTransactionData
     * @property {IAssetAmount|null} [assetAmount] ReissueTransactionData assetAmount
     * @property {boolean|null} [reissuable] ReissueTransactionData reissuable
     */

    /**
     * Constructs a new ReissueTransactionData.
     * @exports ReissueTransactionData
     * @classdesc Represents a ReissueTransactionData.
     * @implements IReissueTransactionData
     * @constructor
     * @param {IReissueTransactionData=} [properties] Properties to set
     */
    function ReissueTransactionData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ReissueTransactionData assetAmount.
     * @member {IAssetAmount|null|undefined} assetAmount
     * @memberof ReissueTransactionData
     * @instance
     */
    ReissueTransactionData.prototype.assetAmount = null;

    /**
     * ReissueTransactionData reissuable.
     * @member {boolean} reissuable
     * @memberof ReissueTransactionData
     * @instance
     */
    ReissueTransactionData.prototype.reissuable = false;

    /**
     * Creates a new ReissueTransactionData instance using the specified properties.
     * @function create
     * @memberof ReissueTransactionData
     * @static
     * @param {IReissueTransactionData=} [properties] Properties to set
     * @returns {ReissueTransactionData} ReissueTransactionData instance
     */
    ReissueTransactionData.create = function create(properties) {
        return new ReissueTransactionData(properties);
    };

    /**
     * Encodes the specified ReissueTransactionData message. Does not implicitly {@link ReissueTransactionData.verify|verify} messages.
     * @function encode
     * @memberof ReissueTransactionData
     * @static
     * @param {IReissueTransactionData} message ReissueTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ReissueTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.assetAmount != null && message.hasOwnProperty("assetAmount"))
            $root.AssetAmount.encode(message.assetAmount, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.reissuable != null && message.hasOwnProperty("reissuable"))
            writer.uint32(/* id 2, wireType 0 =*/16).bool(message.reissuable);
        return writer;
    };

    /**
     * Encodes the specified ReissueTransactionData message, length delimited. Does not implicitly {@link ReissueTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ReissueTransactionData
     * @static
     * @param {IReissueTransactionData} message ReissueTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ReissueTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ReissueTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof ReissueTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ReissueTransactionData} ReissueTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ReissueTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ReissueTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.assetAmount = $root.AssetAmount.decode(reader, reader.uint32());
                break;
            case 2:
                message.reissuable = reader.bool();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ReissueTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ReissueTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ReissueTransactionData} ReissueTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ReissueTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ReissueTransactionData message.
     * @function verify
     * @memberof ReissueTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ReissueTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.assetAmount != null && message.hasOwnProperty("assetAmount")) {
            var error = $root.AssetAmount.verify(message.assetAmount);
            if (error)
                return "assetAmount." + error;
        }
        if (message.reissuable != null && message.hasOwnProperty("reissuable"))
            if (typeof message.reissuable !== "boolean")
                return "reissuable: boolean expected";
        return null;
    };

    /**
     * Creates a ReissueTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ReissueTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ReissueTransactionData} ReissueTransactionData
     */
    ReissueTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.ReissueTransactionData)
            return object;
        var message = new $root.ReissueTransactionData();
        if (object.assetAmount != null) {
            if (typeof object.assetAmount !== "object")
                throw TypeError(".ReissueTransactionData.assetAmount: object expected");
            message.assetAmount = $root.AssetAmount.fromObject(object.assetAmount);
        }
        if (object.reissuable != null)
            message.reissuable = Boolean(object.reissuable);
        return message;
    };

    /**
     * Creates a plain object from a ReissueTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ReissueTransactionData
     * @static
     * @param {ReissueTransactionData} message ReissueTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ReissueTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.assetAmount = null;
            object.reissuable = false;
        }
        if (message.assetAmount != null && message.hasOwnProperty("assetAmount"))
            object.assetAmount = $root.AssetAmount.toObject(message.assetAmount, options);
        if (message.reissuable != null && message.hasOwnProperty("reissuable"))
            object.reissuable = message.reissuable;
        return object;
    };

    /**
     * Converts this ReissueTransactionData to JSON.
     * @function toJSON
     * @memberof ReissueTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ReissueTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ReissueTransactionData;
})();

$root.SetAssetScriptTransactionData = (function() {

    /**
     * Properties of a SetAssetScriptTransactionData.
     * @exports ISetAssetScriptTransactionData
     * @interface ISetAssetScriptTransactionData
     * @property {Uint8Array|null} [assetId] SetAssetScriptTransactionData assetId
     * @property {IScript|null} [script] SetAssetScriptTransactionData script
     */

    /**
     * Constructs a new SetAssetScriptTransactionData.
     * @exports SetAssetScriptTransactionData
     * @classdesc Represents a SetAssetScriptTransactionData.
     * @implements ISetAssetScriptTransactionData
     * @constructor
     * @param {ISetAssetScriptTransactionData=} [properties] Properties to set
     */
    function SetAssetScriptTransactionData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SetAssetScriptTransactionData assetId.
     * @member {Uint8Array} assetId
     * @memberof SetAssetScriptTransactionData
     * @instance
     */
    SetAssetScriptTransactionData.prototype.assetId = $util.newBuffer([]);

    /**
     * SetAssetScriptTransactionData script.
     * @member {IScript|null|undefined} script
     * @memberof SetAssetScriptTransactionData
     * @instance
     */
    SetAssetScriptTransactionData.prototype.script = null;

    /**
     * Creates a new SetAssetScriptTransactionData instance using the specified properties.
     * @function create
     * @memberof SetAssetScriptTransactionData
     * @static
     * @param {ISetAssetScriptTransactionData=} [properties] Properties to set
     * @returns {SetAssetScriptTransactionData} SetAssetScriptTransactionData instance
     */
    SetAssetScriptTransactionData.create = function create(properties) {
        return new SetAssetScriptTransactionData(properties);
    };

    /**
     * Encodes the specified SetAssetScriptTransactionData message. Does not implicitly {@link SetAssetScriptTransactionData.verify|verify} messages.
     * @function encode
     * @memberof SetAssetScriptTransactionData
     * @static
     * @param {ISetAssetScriptTransactionData} message SetAssetScriptTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SetAssetScriptTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.assetId != null && message.hasOwnProperty("assetId"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.assetId);
        if (message.script != null && message.hasOwnProperty("script"))
            $root.Script.encode(message.script, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified SetAssetScriptTransactionData message, length delimited. Does not implicitly {@link SetAssetScriptTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SetAssetScriptTransactionData
     * @static
     * @param {ISetAssetScriptTransactionData} message SetAssetScriptTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SetAssetScriptTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SetAssetScriptTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof SetAssetScriptTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SetAssetScriptTransactionData} SetAssetScriptTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SetAssetScriptTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SetAssetScriptTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.assetId = reader.bytes();
                break;
            case 2:
                message.script = $root.Script.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SetAssetScriptTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SetAssetScriptTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SetAssetScriptTransactionData} SetAssetScriptTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SetAssetScriptTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SetAssetScriptTransactionData message.
     * @function verify
     * @memberof SetAssetScriptTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SetAssetScriptTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.assetId != null && message.hasOwnProperty("assetId"))
            if (!(message.assetId && typeof message.assetId.length === "number" || $util.isString(message.assetId)))
                return "assetId: buffer expected";
        if (message.script != null && message.hasOwnProperty("script")) {
            var error = $root.Script.verify(message.script);
            if (error)
                return "script." + error;
        }
        return null;
    };

    /**
     * Creates a SetAssetScriptTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SetAssetScriptTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SetAssetScriptTransactionData} SetAssetScriptTransactionData
     */
    SetAssetScriptTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.SetAssetScriptTransactionData)
            return object;
        var message = new $root.SetAssetScriptTransactionData();
        if (object.assetId != null)
            if (typeof object.assetId === "string")
                $util.base64.decode(object.assetId, message.assetId = $util.newBuffer($util.base64.length(object.assetId)), 0);
            else if (object.assetId.length)
                message.assetId = object.assetId;
        if (object.script != null) {
            if (typeof object.script !== "object")
                throw TypeError(".SetAssetScriptTransactionData.script: object expected");
            message.script = $root.Script.fromObject(object.script);
        }
        return message;
    };

    /**
     * Creates a plain object from a SetAssetScriptTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SetAssetScriptTransactionData
     * @static
     * @param {SetAssetScriptTransactionData} message SetAssetScriptTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SetAssetScriptTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.assetId = "";
            else {
                object.assetId = [];
                if (options.bytes !== Array)
                    object.assetId = $util.newBuffer(object.assetId);
            }
            object.script = null;
        }
        if (message.assetId != null && message.hasOwnProperty("assetId"))
            object.assetId = options.bytes === String ? $util.base64.encode(message.assetId, 0, message.assetId.length) : options.bytes === Array ? Array.prototype.slice.call(message.assetId) : message.assetId;
        if (message.script != null && message.hasOwnProperty("script"))
            object.script = $root.Script.toObject(message.script, options);
        return object;
    };

    /**
     * Converts this SetAssetScriptTransactionData to JSON.
     * @function toJSON
     * @memberof SetAssetScriptTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SetAssetScriptTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SetAssetScriptTransactionData;
})();

$root.SetScriptTransactionData = (function() {

    /**
     * Properties of a SetScriptTransactionData.
     * @exports ISetScriptTransactionData
     * @interface ISetScriptTransactionData
     * @property {IScript|null} [script] SetScriptTransactionData script
     */

    /**
     * Constructs a new SetScriptTransactionData.
     * @exports SetScriptTransactionData
     * @classdesc Represents a SetScriptTransactionData.
     * @implements ISetScriptTransactionData
     * @constructor
     * @param {ISetScriptTransactionData=} [properties] Properties to set
     */
    function SetScriptTransactionData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SetScriptTransactionData script.
     * @member {IScript|null|undefined} script
     * @memberof SetScriptTransactionData
     * @instance
     */
    SetScriptTransactionData.prototype.script = null;

    /**
     * Creates a new SetScriptTransactionData instance using the specified properties.
     * @function create
     * @memberof SetScriptTransactionData
     * @static
     * @param {ISetScriptTransactionData=} [properties] Properties to set
     * @returns {SetScriptTransactionData} SetScriptTransactionData instance
     */
    SetScriptTransactionData.create = function create(properties) {
        return new SetScriptTransactionData(properties);
    };

    /**
     * Encodes the specified SetScriptTransactionData message. Does not implicitly {@link SetScriptTransactionData.verify|verify} messages.
     * @function encode
     * @memberof SetScriptTransactionData
     * @static
     * @param {ISetScriptTransactionData} message SetScriptTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SetScriptTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.script != null && message.hasOwnProperty("script"))
            $root.Script.encode(message.script, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified SetScriptTransactionData message, length delimited. Does not implicitly {@link SetScriptTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SetScriptTransactionData
     * @static
     * @param {ISetScriptTransactionData} message SetScriptTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SetScriptTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SetScriptTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof SetScriptTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SetScriptTransactionData} SetScriptTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SetScriptTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SetScriptTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 2:
                message.script = $root.Script.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SetScriptTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SetScriptTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SetScriptTransactionData} SetScriptTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SetScriptTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SetScriptTransactionData message.
     * @function verify
     * @memberof SetScriptTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SetScriptTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.script != null && message.hasOwnProperty("script")) {
            var error = $root.Script.verify(message.script);
            if (error)
                return "script." + error;
        }
        return null;
    };

    /**
     * Creates a SetScriptTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SetScriptTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SetScriptTransactionData} SetScriptTransactionData
     */
    SetScriptTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.SetScriptTransactionData)
            return object;
        var message = new $root.SetScriptTransactionData();
        if (object.script != null) {
            if (typeof object.script !== "object")
                throw TypeError(".SetScriptTransactionData.script: object expected");
            message.script = $root.Script.fromObject(object.script);
        }
        return message;
    };

    /**
     * Creates a plain object from a SetScriptTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SetScriptTransactionData
     * @static
     * @param {SetScriptTransactionData} message SetScriptTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SetScriptTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.script = null;
        if (message.script != null && message.hasOwnProperty("script"))
            object.script = $root.Script.toObject(message.script, options);
        return object;
    };

    /**
     * Converts this SetScriptTransactionData to JSON.
     * @function toJSON
     * @memberof SetScriptTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SetScriptTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SetScriptTransactionData;
})();

$root.ExchangeTransactionData = (function() {

    /**
     * Properties of an ExchangeTransactionData.
     * @exports IExchangeTransactionData
     * @interface IExchangeTransactionData
     * @property {Long|null} [amount] ExchangeTransactionData amount
     * @property {Long|null} [price] ExchangeTransactionData price
     * @property {Long|null} [buyMatcherFee] ExchangeTransactionData buyMatcherFee
     * @property {Long|null} [sellMatcherFee] ExchangeTransactionData sellMatcherFee
     * @property {Array.<ExchangeTransactionData.IOrder>|null} [orders] ExchangeTransactionData orders
     * @property {number|null} [taker] ExchangeTransactionData taker
     */

    /**
     * Constructs a new ExchangeTransactionData.
     * @exports ExchangeTransactionData
     * @classdesc Represents an ExchangeTransactionData.
     * @implements IExchangeTransactionData
     * @constructor
     * @param {IExchangeTransactionData=} [properties] Properties to set
     */
    function ExchangeTransactionData(properties) {
        this.orders = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ExchangeTransactionData amount.
     * @member {Long} amount
     * @memberof ExchangeTransactionData
     * @instance
     */
    ExchangeTransactionData.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * ExchangeTransactionData price.
     * @member {Long} price
     * @memberof ExchangeTransactionData
     * @instance
     */
    ExchangeTransactionData.prototype.price = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * ExchangeTransactionData buyMatcherFee.
     * @member {Long} buyMatcherFee
     * @memberof ExchangeTransactionData
     * @instance
     */
    ExchangeTransactionData.prototype.buyMatcherFee = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * ExchangeTransactionData sellMatcherFee.
     * @member {Long} sellMatcherFee
     * @memberof ExchangeTransactionData
     * @instance
     */
    ExchangeTransactionData.prototype.sellMatcherFee = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * ExchangeTransactionData orders.
     * @member {Array.<ExchangeTransactionData.IOrder>} orders
     * @memberof ExchangeTransactionData
     * @instance
     */
    ExchangeTransactionData.prototype.orders = $util.emptyArray;

    /**
     * ExchangeTransactionData taker.
     * @member {number} taker
     * @memberof ExchangeTransactionData
     * @instance
     */
    ExchangeTransactionData.prototype.taker = 0;

    /**
     * Creates a new ExchangeTransactionData instance using the specified properties.
     * @function create
     * @memberof ExchangeTransactionData
     * @static
     * @param {IExchangeTransactionData=} [properties] Properties to set
     * @returns {ExchangeTransactionData} ExchangeTransactionData instance
     */
    ExchangeTransactionData.create = function create(properties) {
        return new ExchangeTransactionData(properties);
    };

    /**
     * Encodes the specified ExchangeTransactionData message. Does not implicitly {@link ExchangeTransactionData.verify|verify} messages.
     * @function encode
     * @memberof ExchangeTransactionData
     * @static
     * @param {IExchangeTransactionData} message ExchangeTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ExchangeTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.amount != null && message.hasOwnProperty("amount"))
            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.amount);
        if (message.price != null && message.hasOwnProperty("price"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.price);
        if (message.buyMatcherFee != null && message.hasOwnProperty("buyMatcherFee"))
            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.buyMatcherFee);
        if (message.sellMatcherFee != null && message.hasOwnProperty("sellMatcherFee"))
            writer.uint32(/* id 4, wireType 0 =*/32).int64(message.sellMatcherFee);
        if (message.orders != null && message.orders.length)
            for (var i = 0; i < message.orders.length; ++i)
                $root.ExchangeTransactionData.Order.encode(message.orders[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.taker != null && message.hasOwnProperty("taker"))
            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.taker);
        return writer;
    };

    /**
     * Encodes the specified ExchangeTransactionData message, length delimited. Does not implicitly {@link ExchangeTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ExchangeTransactionData
     * @static
     * @param {IExchangeTransactionData} message ExchangeTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ExchangeTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ExchangeTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof ExchangeTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ExchangeTransactionData} ExchangeTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ExchangeTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ExchangeTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.amount = reader.int64();
                break;
            case 2:
                message.price = reader.int64();
                break;
            case 3:
                message.buyMatcherFee = reader.int64();
                break;
            case 4:
                message.sellMatcherFee = reader.int64();
                break;
            case 5:
                if (!(message.orders && message.orders.length))
                    message.orders = [];
                message.orders.push($root.ExchangeTransactionData.Order.decode(reader, reader.uint32()));
                break;
            case 6:
                message.taker = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an ExchangeTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ExchangeTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ExchangeTransactionData} ExchangeTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ExchangeTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ExchangeTransactionData message.
     * @function verify
     * @memberof ExchangeTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ExchangeTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                return "amount: integer|Long expected";
        if (message.price != null && message.hasOwnProperty("price"))
            if (!$util.isInteger(message.price) && !(message.price && $util.isInteger(message.price.low) && $util.isInteger(message.price.high)))
                return "price: integer|Long expected";
        if (message.buyMatcherFee != null && message.hasOwnProperty("buyMatcherFee"))
            if (!$util.isInteger(message.buyMatcherFee) && !(message.buyMatcherFee && $util.isInteger(message.buyMatcherFee.low) && $util.isInteger(message.buyMatcherFee.high)))
                return "buyMatcherFee: integer|Long expected";
        if (message.sellMatcherFee != null && message.hasOwnProperty("sellMatcherFee"))
            if (!$util.isInteger(message.sellMatcherFee) && !(message.sellMatcherFee && $util.isInteger(message.sellMatcherFee.low) && $util.isInteger(message.sellMatcherFee.high)))
                return "sellMatcherFee: integer|Long expected";
        if (message.orders != null && message.hasOwnProperty("orders")) {
            if (!Array.isArray(message.orders))
                return "orders: array expected";
            for (var i = 0; i < message.orders.length; ++i) {
                var error = $root.ExchangeTransactionData.Order.verify(message.orders[i]);
                if (error)
                    return "orders." + error;
            }
        }
        if (message.taker != null && message.hasOwnProperty("taker"))
            if (!$util.isInteger(message.taker))
                return "taker: integer expected";
        return null;
    };

    /**
     * Creates an ExchangeTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ExchangeTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ExchangeTransactionData} ExchangeTransactionData
     */
    ExchangeTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.ExchangeTransactionData)
            return object;
        var message = new $root.ExchangeTransactionData();
        if (object.amount != null)
            if ($util.Long)
                (message.amount = $util.Long.fromValue(object.amount)).unsigned = false;
            else if (typeof object.amount === "string")
                message.amount = parseInt(object.amount, 10);
            else if (typeof object.amount === "number")
                message.amount = object.amount;
            else if (typeof object.amount === "object")
                message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber();
        if (object.price != null)
            if ($util.Long)
                (message.price = $util.Long.fromValue(object.price)).unsigned = false;
            else if (typeof object.price === "string")
                message.price = parseInt(object.price, 10);
            else if (typeof object.price === "number")
                message.price = object.price;
            else if (typeof object.price === "object")
                message.price = new $util.LongBits(object.price.low >>> 0, object.price.high >>> 0).toNumber();
        if (object.buyMatcherFee != null)
            if ($util.Long)
                (message.buyMatcherFee = $util.Long.fromValue(object.buyMatcherFee)).unsigned = false;
            else if (typeof object.buyMatcherFee === "string")
                message.buyMatcherFee = parseInt(object.buyMatcherFee, 10);
            else if (typeof object.buyMatcherFee === "number")
                message.buyMatcherFee = object.buyMatcherFee;
            else if (typeof object.buyMatcherFee === "object")
                message.buyMatcherFee = new $util.LongBits(object.buyMatcherFee.low >>> 0, object.buyMatcherFee.high >>> 0).toNumber();
        if (object.sellMatcherFee != null)
            if ($util.Long)
                (message.sellMatcherFee = $util.Long.fromValue(object.sellMatcherFee)).unsigned = false;
            else if (typeof object.sellMatcherFee === "string")
                message.sellMatcherFee = parseInt(object.sellMatcherFee, 10);
            else if (typeof object.sellMatcherFee === "number")
                message.sellMatcherFee = object.sellMatcherFee;
            else if (typeof object.sellMatcherFee === "object")
                message.sellMatcherFee = new $util.LongBits(object.sellMatcherFee.low >>> 0, object.sellMatcherFee.high >>> 0).toNumber();
        if (object.orders) {
            if (!Array.isArray(object.orders))
                throw TypeError(".ExchangeTransactionData.orders: array expected");
            message.orders = [];
            for (var i = 0; i < object.orders.length; ++i) {
                if (typeof object.orders[i] !== "object")
                    throw TypeError(".ExchangeTransactionData.orders: object expected");
                message.orders[i] = $root.ExchangeTransactionData.Order.fromObject(object.orders[i]);
            }
        }
        if (object.taker != null)
            message.taker = object.taker | 0;
        return message;
    };

    /**
     * Creates a plain object from an ExchangeTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ExchangeTransactionData
     * @static
     * @param {ExchangeTransactionData} message ExchangeTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ExchangeTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.orders = [];
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.amount = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.price = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.price = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.buyMatcherFee = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.buyMatcherFee = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.sellMatcherFee = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.sellMatcherFee = options.longs === String ? "0" : 0;
            object.taker = 0;
        }
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (typeof message.amount === "number")
                object.amount = options.longs === String ? String(message.amount) : message.amount;
            else
                object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber() : message.amount;
        if (message.price != null && message.hasOwnProperty("price"))
            if (typeof message.price === "number")
                object.price = options.longs === String ? String(message.price) : message.price;
            else
                object.price = options.longs === String ? $util.Long.prototype.toString.call(message.price) : options.longs === Number ? new $util.LongBits(message.price.low >>> 0, message.price.high >>> 0).toNumber() : message.price;
        if (message.buyMatcherFee != null && message.hasOwnProperty("buyMatcherFee"))
            if (typeof message.buyMatcherFee === "number")
                object.buyMatcherFee = options.longs === String ? String(message.buyMatcherFee) : message.buyMatcherFee;
            else
                object.buyMatcherFee = options.longs === String ? $util.Long.prototype.toString.call(message.buyMatcherFee) : options.longs === Number ? new $util.LongBits(message.buyMatcherFee.low >>> 0, message.buyMatcherFee.high >>> 0).toNumber() : message.buyMatcherFee;
        if (message.sellMatcherFee != null && message.hasOwnProperty("sellMatcherFee"))
            if (typeof message.sellMatcherFee === "number")
                object.sellMatcherFee = options.longs === String ? String(message.sellMatcherFee) : message.sellMatcherFee;
            else
                object.sellMatcherFee = options.longs === String ? $util.Long.prototype.toString.call(message.sellMatcherFee) : options.longs === Number ? new $util.LongBits(message.sellMatcherFee.low >>> 0, message.sellMatcherFee.high >>> 0).toNumber() : message.sellMatcherFee;
        if (message.orders && message.orders.length) {
            object.orders = [];
            for (var j = 0; j < message.orders.length; ++j)
                object.orders[j] = $root.ExchangeTransactionData.Order.toObject(message.orders[j], options);
        }
        if (message.taker != null && message.hasOwnProperty("taker"))
            object.taker = message.taker;
        return object;
    };

    /**
     * Converts this ExchangeTransactionData to JSON.
     * @function toJSON
     * @memberof ExchangeTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ExchangeTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    ExchangeTransactionData.BuySellOrders = (function() {

        /**
         * Properties of a BuySellOrders.
         * @memberof ExchangeTransactionData
         * @interface IBuySellOrders
         * @property {ExchangeTransactionData.IOrder|null} [buyOrder] BuySellOrders buyOrder
         * @property {ExchangeTransactionData.IOrder|null} [sellOrder] BuySellOrders sellOrder
         */

        /**
         * Constructs a new BuySellOrders.
         * @memberof ExchangeTransactionData
         * @classdesc Represents a BuySellOrders.
         * @implements IBuySellOrders
         * @constructor
         * @param {ExchangeTransactionData.IBuySellOrders=} [properties] Properties to set
         */
        function BuySellOrders(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BuySellOrders buyOrder.
         * @member {ExchangeTransactionData.IOrder|null|undefined} buyOrder
         * @memberof ExchangeTransactionData.BuySellOrders
         * @instance
         */
        BuySellOrders.prototype.buyOrder = null;

        /**
         * BuySellOrders sellOrder.
         * @member {ExchangeTransactionData.IOrder|null|undefined} sellOrder
         * @memberof ExchangeTransactionData.BuySellOrders
         * @instance
         */
        BuySellOrders.prototype.sellOrder = null;

        /**
         * Creates a new BuySellOrders instance using the specified properties.
         * @function create
         * @memberof ExchangeTransactionData.BuySellOrders
         * @static
         * @param {ExchangeTransactionData.IBuySellOrders=} [properties] Properties to set
         * @returns {ExchangeTransactionData.BuySellOrders} BuySellOrders instance
         */
        BuySellOrders.create = function create(properties) {
            return new BuySellOrders(properties);
        };

        /**
         * Encodes the specified BuySellOrders message. Does not implicitly {@link ExchangeTransactionData.BuySellOrders.verify|verify} messages.
         * @function encode
         * @memberof ExchangeTransactionData.BuySellOrders
         * @static
         * @param {ExchangeTransactionData.IBuySellOrders} message BuySellOrders message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BuySellOrders.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.buyOrder != null && message.hasOwnProperty("buyOrder"))
                $root.ExchangeTransactionData.Order.encode(message.buyOrder, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.sellOrder != null && message.hasOwnProperty("sellOrder"))
                $root.ExchangeTransactionData.Order.encode(message.sellOrder, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified BuySellOrders message, length delimited. Does not implicitly {@link ExchangeTransactionData.BuySellOrders.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ExchangeTransactionData.BuySellOrders
         * @static
         * @param {ExchangeTransactionData.IBuySellOrders} message BuySellOrders message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BuySellOrders.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BuySellOrders message from the specified reader or buffer.
         * @function decode
         * @memberof ExchangeTransactionData.BuySellOrders
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ExchangeTransactionData.BuySellOrders} BuySellOrders
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BuySellOrders.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ExchangeTransactionData.BuySellOrders();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.buyOrder = $root.ExchangeTransactionData.Order.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.sellOrder = $root.ExchangeTransactionData.Order.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BuySellOrders message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ExchangeTransactionData.BuySellOrders
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ExchangeTransactionData.BuySellOrders} BuySellOrders
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BuySellOrders.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BuySellOrders message.
         * @function verify
         * @memberof ExchangeTransactionData.BuySellOrders
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BuySellOrders.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.buyOrder != null && message.hasOwnProperty("buyOrder")) {
                var error = $root.ExchangeTransactionData.Order.verify(message.buyOrder);
                if (error)
                    return "buyOrder." + error;
            }
            if (message.sellOrder != null && message.hasOwnProperty("sellOrder")) {
                var error = $root.ExchangeTransactionData.Order.verify(message.sellOrder);
                if (error)
                    return "sellOrder." + error;
            }
            return null;
        };

        /**
         * Creates a BuySellOrders message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ExchangeTransactionData.BuySellOrders
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ExchangeTransactionData.BuySellOrders} BuySellOrders
         */
        BuySellOrders.fromObject = function fromObject(object) {
            if (object instanceof $root.ExchangeTransactionData.BuySellOrders)
                return object;
            var message = new $root.ExchangeTransactionData.BuySellOrders();
            if (object.buyOrder != null) {
                if (typeof object.buyOrder !== "object")
                    throw TypeError(".ExchangeTransactionData.BuySellOrders.buyOrder: object expected");
                message.buyOrder = $root.ExchangeTransactionData.Order.fromObject(object.buyOrder);
            }
            if (object.sellOrder != null) {
                if (typeof object.sellOrder !== "object")
                    throw TypeError(".ExchangeTransactionData.BuySellOrders.sellOrder: object expected");
                message.sellOrder = $root.ExchangeTransactionData.Order.fromObject(object.sellOrder);
            }
            return message;
        };

        /**
         * Creates a plain object from a BuySellOrders message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ExchangeTransactionData.BuySellOrders
         * @static
         * @param {ExchangeTransactionData.BuySellOrders} message BuySellOrders
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BuySellOrders.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.buyOrder = null;
                object.sellOrder = null;
            }
            if (message.buyOrder != null && message.hasOwnProperty("buyOrder"))
                object.buyOrder = $root.ExchangeTransactionData.Order.toObject(message.buyOrder, options);
            if (message.sellOrder != null && message.hasOwnProperty("sellOrder"))
                object.sellOrder = $root.ExchangeTransactionData.Order.toObject(message.sellOrder, options);
            return object;
        };

        /**
         * Converts this BuySellOrders to JSON.
         * @function toJSON
         * @memberof ExchangeTransactionData.BuySellOrders
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BuySellOrders.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BuySellOrders;
    })();

    ExchangeTransactionData.MakerTakerOrders = (function() {

        /**
         * Properties of a MakerTakerOrders.
         * @memberof ExchangeTransactionData
         * @interface IMakerTakerOrders
         * @property {ExchangeTransactionData.IOrder|null} [makerOrder] MakerTakerOrders makerOrder
         * @property {ExchangeTransactionData.IOrder|null} [takerOrder] MakerTakerOrders takerOrder
         */

        /**
         * Constructs a new MakerTakerOrders.
         * @memberof ExchangeTransactionData
         * @classdesc Represents a MakerTakerOrders.
         * @implements IMakerTakerOrders
         * @constructor
         * @param {ExchangeTransactionData.IMakerTakerOrders=} [properties] Properties to set
         */
        function MakerTakerOrders(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MakerTakerOrders makerOrder.
         * @member {ExchangeTransactionData.IOrder|null|undefined} makerOrder
         * @memberof ExchangeTransactionData.MakerTakerOrders
         * @instance
         */
        MakerTakerOrders.prototype.makerOrder = null;

        /**
         * MakerTakerOrders takerOrder.
         * @member {ExchangeTransactionData.IOrder|null|undefined} takerOrder
         * @memberof ExchangeTransactionData.MakerTakerOrders
         * @instance
         */
        MakerTakerOrders.prototype.takerOrder = null;

        /**
         * Creates a new MakerTakerOrders instance using the specified properties.
         * @function create
         * @memberof ExchangeTransactionData.MakerTakerOrders
         * @static
         * @param {ExchangeTransactionData.IMakerTakerOrders=} [properties] Properties to set
         * @returns {ExchangeTransactionData.MakerTakerOrders} MakerTakerOrders instance
         */
        MakerTakerOrders.create = function create(properties) {
            return new MakerTakerOrders(properties);
        };

        /**
         * Encodes the specified MakerTakerOrders message. Does not implicitly {@link ExchangeTransactionData.MakerTakerOrders.verify|verify} messages.
         * @function encode
         * @memberof ExchangeTransactionData.MakerTakerOrders
         * @static
         * @param {ExchangeTransactionData.IMakerTakerOrders} message MakerTakerOrders message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MakerTakerOrders.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.makerOrder != null && message.hasOwnProperty("makerOrder"))
                $root.ExchangeTransactionData.Order.encode(message.makerOrder, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.takerOrder != null && message.hasOwnProperty("takerOrder"))
                $root.ExchangeTransactionData.Order.encode(message.takerOrder, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified MakerTakerOrders message, length delimited. Does not implicitly {@link ExchangeTransactionData.MakerTakerOrders.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ExchangeTransactionData.MakerTakerOrders
         * @static
         * @param {ExchangeTransactionData.IMakerTakerOrders} message MakerTakerOrders message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MakerTakerOrders.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MakerTakerOrders message from the specified reader or buffer.
         * @function decode
         * @memberof ExchangeTransactionData.MakerTakerOrders
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ExchangeTransactionData.MakerTakerOrders} MakerTakerOrders
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MakerTakerOrders.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ExchangeTransactionData.MakerTakerOrders();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.makerOrder = $root.ExchangeTransactionData.Order.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.takerOrder = $root.ExchangeTransactionData.Order.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MakerTakerOrders message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ExchangeTransactionData.MakerTakerOrders
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ExchangeTransactionData.MakerTakerOrders} MakerTakerOrders
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MakerTakerOrders.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MakerTakerOrders message.
         * @function verify
         * @memberof ExchangeTransactionData.MakerTakerOrders
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MakerTakerOrders.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.makerOrder != null && message.hasOwnProperty("makerOrder")) {
                var error = $root.ExchangeTransactionData.Order.verify(message.makerOrder);
                if (error)
                    return "makerOrder." + error;
            }
            if (message.takerOrder != null && message.hasOwnProperty("takerOrder")) {
                var error = $root.ExchangeTransactionData.Order.verify(message.takerOrder);
                if (error)
                    return "takerOrder." + error;
            }
            return null;
        };

        /**
         * Creates a MakerTakerOrders message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ExchangeTransactionData.MakerTakerOrders
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ExchangeTransactionData.MakerTakerOrders} MakerTakerOrders
         */
        MakerTakerOrders.fromObject = function fromObject(object) {
            if (object instanceof $root.ExchangeTransactionData.MakerTakerOrders)
                return object;
            var message = new $root.ExchangeTransactionData.MakerTakerOrders();
            if (object.makerOrder != null) {
                if (typeof object.makerOrder !== "object")
                    throw TypeError(".ExchangeTransactionData.MakerTakerOrders.makerOrder: object expected");
                message.makerOrder = $root.ExchangeTransactionData.Order.fromObject(object.makerOrder);
            }
            if (object.takerOrder != null) {
                if (typeof object.takerOrder !== "object")
                    throw TypeError(".ExchangeTransactionData.MakerTakerOrders.takerOrder: object expected");
                message.takerOrder = $root.ExchangeTransactionData.Order.fromObject(object.takerOrder);
            }
            return message;
        };

        /**
         * Creates a plain object from a MakerTakerOrders message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ExchangeTransactionData.MakerTakerOrders
         * @static
         * @param {ExchangeTransactionData.MakerTakerOrders} message MakerTakerOrders
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MakerTakerOrders.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.makerOrder = null;
                object.takerOrder = null;
            }
            if (message.makerOrder != null && message.hasOwnProperty("makerOrder"))
                object.makerOrder = $root.ExchangeTransactionData.Order.toObject(message.makerOrder, options);
            if (message.takerOrder != null && message.hasOwnProperty("takerOrder"))
                object.takerOrder = $root.ExchangeTransactionData.Order.toObject(message.takerOrder, options);
            return object;
        };

        /**
         * Converts this MakerTakerOrders to JSON.
         * @function toJSON
         * @memberof ExchangeTransactionData.MakerTakerOrders
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MakerTakerOrders.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MakerTakerOrders;
    })();

    ExchangeTransactionData.Order = (function() {

        /**
         * Properties of an Order.
         * @memberof ExchangeTransactionData
         * @interface IOrder
         * @property {number|null} [chainId] Order chainId
         * @property {Uint8Array|null} [senderPublicKey] Order senderPublicKey
         * @property {Uint8Array|null} [matcherPublicKey] Order matcherPublicKey
         * @property {ExchangeTransactionData.Order.IAssetPair|null} [assetPair] Order assetPair
         * @property {ExchangeTransactionData.Order.Side|null} [orderSide] Order orderSide
         * @property {Long|null} [amount] Order amount
         * @property {Long|null} [price] Order price
         * @property {Long|null} [timestamp] Order timestamp
         * @property {Long|null} [expiration] Order expiration
         * @property {IAmount|null} [matcherFee] Order matcherFee
         * @property {number|null} [version] Order version
         * @property {Array.<Uint8Array>|null} [proofs] Order proofs
         */

        /**
         * Constructs a new Order.
         * @memberof ExchangeTransactionData
         * @classdesc Represents an Order.
         * @implements IOrder
         * @constructor
         * @param {ExchangeTransactionData.IOrder=} [properties] Properties to set
         */
        function Order(properties) {
            this.proofs = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Order chainId.
         * @member {number} chainId
         * @memberof ExchangeTransactionData.Order
         * @instance
         */
        Order.prototype.chainId = 0;

        /**
         * Order senderPublicKey.
         * @member {Uint8Array} senderPublicKey
         * @memberof ExchangeTransactionData.Order
         * @instance
         */
        Order.prototype.senderPublicKey = $util.newBuffer([]);

        /**
         * Order matcherPublicKey.
         * @member {Uint8Array} matcherPublicKey
         * @memberof ExchangeTransactionData.Order
         * @instance
         */
        Order.prototype.matcherPublicKey = $util.newBuffer([]);

        /**
         * Order assetPair.
         * @member {ExchangeTransactionData.Order.IAssetPair|null|undefined} assetPair
         * @memberof ExchangeTransactionData.Order
         * @instance
         */
        Order.prototype.assetPair = null;

        /**
         * Order orderSide.
         * @member {ExchangeTransactionData.Order.Side} orderSide
         * @memberof ExchangeTransactionData.Order
         * @instance
         */
        Order.prototype.orderSide = 0;

        /**
         * Order amount.
         * @member {Long} amount
         * @memberof ExchangeTransactionData.Order
         * @instance
         */
        Order.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Order price.
         * @member {Long} price
         * @memberof ExchangeTransactionData.Order
         * @instance
         */
        Order.prototype.price = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Order timestamp.
         * @member {Long} timestamp
         * @memberof ExchangeTransactionData.Order
         * @instance
         */
        Order.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Order expiration.
         * @member {Long} expiration
         * @memberof ExchangeTransactionData.Order
         * @instance
         */
        Order.prototype.expiration = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Order matcherFee.
         * @member {IAmount|null|undefined} matcherFee
         * @memberof ExchangeTransactionData.Order
         * @instance
         */
        Order.prototype.matcherFee = null;

        /**
         * Order version.
         * @member {number} version
         * @memberof ExchangeTransactionData.Order
         * @instance
         */
        Order.prototype.version = 0;

        /**
         * Order proofs.
         * @member {Array.<Uint8Array>} proofs
         * @memberof ExchangeTransactionData.Order
         * @instance
         */
        Order.prototype.proofs = $util.emptyArray;

        /**
         * Creates a new Order instance using the specified properties.
         * @function create
         * @memberof ExchangeTransactionData.Order
         * @static
         * @param {ExchangeTransactionData.IOrder=} [properties] Properties to set
         * @returns {ExchangeTransactionData.Order} Order instance
         */
        Order.create = function create(properties) {
            return new Order(properties);
        };

        /**
         * Encodes the specified Order message. Does not implicitly {@link ExchangeTransactionData.Order.verify|verify} messages.
         * @function encode
         * @memberof ExchangeTransactionData.Order
         * @static
         * @param {ExchangeTransactionData.IOrder} message Order message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Order.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.chainId != null && message.hasOwnProperty("chainId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.chainId);
            if (message.senderPublicKey != null && message.hasOwnProperty("senderPublicKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.senderPublicKey);
            if (message.matcherPublicKey != null && message.hasOwnProperty("matcherPublicKey"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.matcherPublicKey);
            if (message.assetPair != null && message.hasOwnProperty("assetPair"))
                $root.ExchangeTransactionData.Order.AssetPair.encode(message.assetPair, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.orderSide != null && message.hasOwnProperty("orderSide"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.orderSide);
            if (message.amount != null && message.hasOwnProperty("amount"))
                writer.uint32(/* id 6, wireType 0 =*/48).int64(message.amount);
            if (message.price != null && message.hasOwnProperty("price"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.price);
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                writer.uint32(/* id 8, wireType 0 =*/64).int64(message.timestamp);
            if (message.expiration != null && message.hasOwnProperty("expiration"))
                writer.uint32(/* id 9, wireType 0 =*/72).int64(message.expiration);
            if (message.matcherFee != null && message.hasOwnProperty("matcherFee"))
                $root.Amount.encode(message.matcherFee, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.version != null && message.hasOwnProperty("version"))
                writer.uint32(/* id 11, wireType 0 =*/88).int32(message.version);
            if (message.proofs != null && message.proofs.length)
                for (var i = 0; i < message.proofs.length; ++i)
                    writer.uint32(/* id 12, wireType 2 =*/98).bytes(message.proofs[i]);
            return writer;
        };

        /**
         * Encodes the specified Order message, length delimited. Does not implicitly {@link ExchangeTransactionData.Order.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ExchangeTransactionData.Order
         * @static
         * @param {ExchangeTransactionData.IOrder} message Order message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Order.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Order message from the specified reader or buffer.
         * @function decode
         * @memberof ExchangeTransactionData.Order
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ExchangeTransactionData.Order} Order
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Order.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ExchangeTransactionData.Order();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.chainId = reader.int32();
                    break;
                case 2:
                    message.senderPublicKey = reader.bytes();
                    break;
                case 3:
                    message.matcherPublicKey = reader.bytes();
                    break;
                case 4:
                    message.assetPair = $root.ExchangeTransactionData.Order.AssetPair.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.orderSide = reader.int32();
                    break;
                case 6:
                    message.amount = reader.int64();
                    break;
                case 7:
                    message.price = reader.int64();
                    break;
                case 8:
                    message.timestamp = reader.int64();
                    break;
                case 9:
                    message.expiration = reader.int64();
                    break;
                case 10:
                    message.matcherFee = $root.Amount.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.version = reader.int32();
                    break;
                case 12:
                    if (!(message.proofs && message.proofs.length))
                        message.proofs = [];
                    message.proofs.push(reader.bytes());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Order message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ExchangeTransactionData.Order
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ExchangeTransactionData.Order} Order
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Order.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Order message.
         * @function verify
         * @memberof ExchangeTransactionData.Order
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Order.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.chainId != null && message.hasOwnProperty("chainId"))
                if (!$util.isInteger(message.chainId))
                    return "chainId: integer expected";
            if (message.senderPublicKey != null && message.hasOwnProperty("senderPublicKey"))
                if (!(message.senderPublicKey && typeof message.senderPublicKey.length === "number" || $util.isString(message.senderPublicKey)))
                    return "senderPublicKey: buffer expected";
            if (message.matcherPublicKey != null && message.hasOwnProperty("matcherPublicKey"))
                if (!(message.matcherPublicKey && typeof message.matcherPublicKey.length === "number" || $util.isString(message.matcherPublicKey)))
                    return "matcherPublicKey: buffer expected";
            if (message.assetPair != null && message.hasOwnProperty("assetPair")) {
                var error = $root.ExchangeTransactionData.Order.AssetPair.verify(message.assetPair);
                if (error)
                    return "assetPair." + error;
            }
            if (message.orderSide != null && message.hasOwnProperty("orderSide"))
                switch (message.orderSide) {
                default:
                    return "orderSide: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                    return "amount: integer|Long expected";
            if (message.price != null && message.hasOwnProperty("price"))
                if (!$util.isInteger(message.price) && !(message.price && $util.isInteger(message.price.low) && $util.isInteger(message.price.high)))
                    return "price: integer|Long expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.expiration != null && message.hasOwnProperty("expiration"))
                if (!$util.isInteger(message.expiration) && !(message.expiration && $util.isInteger(message.expiration.low) && $util.isInteger(message.expiration.high)))
                    return "expiration: integer|Long expected";
            if (message.matcherFee != null && message.hasOwnProperty("matcherFee")) {
                var error = $root.Amount.verify(message.matcherFee);
                if (error)
                    return "matcherFee." + error;
            }
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            if (message.proofs != null && message.hasOwnProperty("proofs")) {
                if (!Array.isArray(message.proofs))
                    return "proofs: array expected";
                for (var i = 0; i < message.proofs.length; ++i)
                    if (!(message.proofs[i] && typeof message.proofs[i].length === "number" || $util.isString(message.proofs[i])))
                        return "proofs: buffer[] expected";
            }
            return null;
        };

        /**
         * Creates an Order message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ExchangeTransactionData.Order
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ExchangeTransactionData.Order} Order
         */
        Order.fromObject = function fromObject(object) {
            if (object instanceof $root.ExchangeTransactionData.Order)
                return object;
            var message = new $root.ExchangeTransactionData.Order();
            if (object.chainId != null)
                message.chainId = object.chainId | 0;
            if (object.senderPublicKey != null)
                if (typeof object.senderPublicKey === "string")
                    $util.base64.decode(object.senderPublicKey, message.senderPublicKey = $util.newBuffer($util.base64.length(object.senderPublicKey)), 0);
                else if (object.senderPublicKey.length)
                    message.senderPublicKey = object.senderPublicKey;
            if (object.matcherPublicKey != null)
                if (typeof object.matcherPublicKey === "string")
                    $util.base64.decode(object.matcherPublicKey, message.matcherPublicKey = $util.newBuffer($util.base64.length(object.matcherPublicKey)), 0);
                else if (object.matcherPublicKey.length)
                    message.matcherPublicKey = object.matcherPublicKey;
            if (object.assetPair != null) {
                if (typeof object.assetPair !== "object")
                    throw TypeError(".ExchangeTransactionData.Order.assetPair: object expected");
                message.assetPair = $root.ExchangeTransactionData.Order.AssetPair.fromObject(object.assetPair);
            }
            switch (object.orderSide) {
            case "BUY":
            case 0:
                message.orderSide = 0;
                break;
            case "SELL":
            case 1:
                message.orderSide = 1;
                break;
            }
            if (object.amount != null)
                if ($util.Long)
                    (message.amount = $util.Long.fromValue(object.amount)).unsigned = false;
                else if (typeof object.amount === "string")
                    message.amount = parseInt(object.amount, 10);
                else if (typeof object.amount === "number")
                    message.amount = object.amount;
                else if (typeof object.amount === "object")
                    message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber();
            if (object.price != null)
                if ($util.Long)
                    (message.price = $util.Long.fromValue(object.price)).unsigned = false;
                else if (typeof object.price === "string")
                    message.price = parseInt(object.price, 10);
                else if (typeof object.price === "number")
                    message.price = object.price;
                else if (typeof object.price === "object")
                    message.price = new $util.LongBits(object.price.low >>> 0, object.price.high >>> 0).toNumber();
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.expiration != null)
                if ($util.Long)
                    (message.expiration = $util.Long.fromValue(object.expiration)).unsigned = false;
                else if (typeof object.expiration === "string")
                    message.expiration = parseInt(object.expiration, 10);
                else if (typeof object.expiration === "number")
                    message.expiration = object.expiration;
                else if (typeof object.expiration === "object")
                    message.expiration = new $util.LongBits(object.expiration.low >>> 0, object.expiration.high >>> 0).toNumber();
            if (object.matcherFee != null) {
                if (typeof object.matcherFee !== "object")
                    throw TypeError(".ExchangeTransactionData.Order.matcherFee: object expected");
                message.matcherFee = $root.Amount.fromObject(object.matcherFee);
            }
            if (object.version != null)
                message.version = object.version | 0;
            if (object.proofs) {
                if (!Array.isArray(object.proofs))
                    throw TypeError(".ExchangeTransactionData.Order.proofs: array expected");
                message.proofs = [];
                for (var i = 0; i < object.proofs.length; ++i)
                    if (typeof object.proofs[i] === "string")
                        $util.base64.decode(object.proofs[i], message.proofs[i] = $util.newBuffer($util.base64.length(object.proofs[i])), 0);
                    else if (object.proofs[i].length)
                        message.proofs[i] = object.proofs[i];
            }
            return message;
        };

        /**
         * Creates a plain object from an Order message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ExchangeTransactionData.Order
         * @static
         * @param {ExchangeTransactionData.Order} message Order
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Order.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.proofs = [];
            if (options.defaults) {
                object.chainId = 0;
                if (options.bytes === String)
                    object.senderPublicKey = "";
                else {
                    object.senderPublicKey = [];
                    if (options.bytes !== Array)
                        object.senderPublicKey = $util.newBuffer(object.senderPublicKey);
                }
                if (options.bytes === String)
                    object.matcherPublicKey = "";
                else {
                    object.matcherPublicKey = [];
                    if (options.bytes !== Array)
                        object.matcherPublicKey = $util.newBuffer(object.matcherPublicKey);
                }
                object.assetPair = null;
                object.orderSide = options.enums === String ? "BUY" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.amount = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.price = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.price = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.expiration = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.expiration = options.longs === String ? "0" : 0;
                object.matcherFee = null;
                object.version = 0;
            }
            if (message.chainId != null && message.hasOwnProperty("chainId"))
                object.chainId = message.chainId;
            if (message.senderPublicKey != null && message.hasOwnProperty("senderPublicKey"))
                object.senderPublicKey = options.bytes === String ? $util.base64.encode(message.senderPublicKey, 0, message.senderPublicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.senderPublicKey) : message.senderPublicKey;
            if (message.matcherPublicKey != null && message.hasOwnProperty("matcherPublicKey"))
                object.matcherPublicKey = options.bytes === String ? $util.base64.encode(message.matcherPublicKey, 0, message.matcherPublicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.matcherPublicKey) : message.matcherPublicKey;
            if (message.assetPair != null && message.hasOwnProperty("assetPair"))
                object.assetPair = $root.ExchangeTransactionData.Order.AssetPair.toObject(message.assetPair, options);
            if (message.orderSide != null && message.hasOwnProperty("orderSide"))
                object.orderSide = options.enums === String ? $root.ExchangeTransactionData.Order.Side[message.orderSide] : message.orderSide;
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (typeof message.amount === "number")
                    object.amount = options.longs === String ? String(message.amount) : message.amount;
                else
                    object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber() : message.amount;
            if (message.price != null && message.hasOwnProperty("price"))
                if (typeof message.price === "number")
                    object.price = options.longs === String ? String(message.price) : message.price;
                else
                    object.price = options.longs === String ? $util.Long.prototype.toString.call(message.price) : options.longs === Number ? new $util.LongBits(message.price.low >>> 0, message.price.high >>> 0).toNumber() : message.price;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.expiration != null && message.hasOwnProperty("expiration"))
                if (typeof message.expiration === "number")
                    object.expiration = options.longs === String ? String(message.expiration) : message.expiration;
                else
                    object.expiration = options.longs === String ? $util.Long.prototype.toString.call(message.expiration) : options.longs === Number ? new $util.LongBits(message.expiration.low >>> 0, message.expiration.high >>> 0).toNumber() : message.expiration;
            if (message.matcherFee != null && message.hasOwnProperty("matcherFee"))
                object.matcherFee = $root.Amount.toObject(message.matcherFee, options);
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.proofs && message.proofs.length) {
                object.proofs = [];
                for (var j = 0; j < message.proofs.length; ++j)
                    object.proofs[j] = options.bytes === String ? $util.base64.encode(message.proofs[j], 0, message.proofs[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.proofs[j]) : message.proofs[j];
            }
            return object;
        };

        /**
         * Converts this Order to JSON.
         * @function toJSON
         * @memberof ExchangeTransactionData.Order
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Order.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Side enum.
         * @name ExchangeTransactionData.Order.Side
         * @enum {string}
         * @property {number} BUY=0 BUY value
         * @property {number} SELL=1 SELL value
         */
        Order.Side = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "BUY"] = 0;
            values[valuesById[1] = "SELL"] = 1;
            return values;
        })();

        Order.AssetPair = (function() {

            /**
             * Properties of an AssetPair.
             * @memberof ExchangeTransactionData.Order
             * @interface IAssetPair
             * @property {Uint8Array|null} [amountAssetId] AssetPair amountAssetId
             * @property {Uint8Array|null} [priceAssetId] AssetPair priceAssetId
             */

            /**
             * Constructs a new AssetPair.
             * @memberof ExchangeTransactionData.Order
             * @classdesc Represents an AssetPair.
             * @implements IAssetPair
             * @constructor
             * @param {ExchangeTransactionData.Order.IAssetPair=} [properties] Properties to set
             */
            function AssetPair(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AssetPair amountAssetId.
             * @member {Uint8Array} amountAssetId
             * @memberof ExchangeTransactionData.Order.AssetPair
             * @instance
             */
            AssetPair.prototype.amountAssetId = $util.newBuffer([]);

            /**
             * AssetPair priceAssetId.
             * @member {Uint8Array} priceAssetId
             * @memberof ExchangeTransactionData.Order.AssetPair
             * @instance
             */
            AssetPair.prototype.priceAssetId = $util.newBuffer([]);

            /**
             * Creates a new AssetPair instance using the specified properties.
             * @function create
             * @memberof ExchangeTransactionData.Order.AssetPair
             * @static
             * @param {ExchangeTransactionData.Order.IAssetPair=} [properties] Properties to set
             * @returns {ExchangeTransactionData.Order.AssetPair} AssetPair instance
             */
            AssetPair.create = function create(properties) {
                return new AssetPair(properties);
            };

            /**
             * Encodes the specified AssetPair message. Does not implicitly {@link ExchangeTransactionData.Order.AssetPair.verify|verify} messages.
             * @function encode
             * @memberof ExchangeTransactionData.Order.AssetPair
             * @static
             * @param {ExchangeTransactionData.Order.IAssetPair} message AssetPair message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AssetPair.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.amountAssetId != null && message.hasOwnProperty("amountAssetId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.amountAssetId);
                if (message.priceAssetId != null && message.hasOwnProperty("priceAssetId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.priceAssetId);
                return writer;
            };

            /**
             * Encodes the specified AssetPair message, length delimited. Does not implicitly {@link ExchangeTransactionData.Order.AssetPair.verify|verify} messages.
             * @function encodeDelimited
             * @memberof ExchangeTransactionData.Order.AssetPair
             * @static
             * @param {ExchangeTransactionData.Order.IAssetPair} message AssetPair message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AssetPair.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AssetPair message from the specified reader or buffer.
             * @function decode
             * @memberof ExchangeTransactionData.Order.AssetPair
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {ExchangeTransactionData.Order.AssetPair} AssetPair
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AssetPair.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ExchangeTransactionData.Order.AssetPair();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.amountAssetId = reader.bytes();
                        break;
                    case 2:
                        message.priceAssetId = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an AssetPair message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof ExchangeTransactionData.Order.AssetPair
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {ExchangeTransactionData.Order.AssetPair} AssetPair
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AssetPair.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AssetPair message.
             * @function verify
             * @memberof ExchangeTransactionData.Order.AssetPair
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AssetPair.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.amountAssetId != null && message.hasOwnProperty("amountAssetId"))
                    if (!(message.amountAssetId && typeof message.amountAssetId.length === "number" || $util.isString(message.amountAssetId)))
                        return "amountAssetId: buffer expected";
                if (message.priceAssetId != null && message.hasOwnProperty("priceAssetId"))
                    if (!(message.priceAssetId && typeof message.priceAssetId.length === "number" || $util.isString(message.priceAssetId)))
                        return "priceAssetId: buffer expected";
                return null;
            };

            /**
             * Creates an AssetPair message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof ExchangeTransactionData.Order.AssetPair
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {ExchangeTransactionData.Order.AssetPair} AssetPair
             */
            AssetPair.fromObject = function fromObject(object) {
                if (object instanceof $root.ExchangeTransactionData.Order.AssetPair)
                    return object;
                var message = new $root.ExchangeTransactionData.Order.AssetPair();
                if (object.amountAssetId != null)
                    if (typeof object.amountAssetId === "string")
                        $util.base64.decode(object.amountAssetId, message.amountAssetId = $util.newBuffer($util.base64.length(object.amountAssetId)), 0);
                    else if (object.amountAssetId.length)
                        message.amountAssetId = object.amountAssetId;
                if (object.priceAssetId != null)
                    if (typeof object.priceAssetId === "string")
                        $util.base64.decode(object.priceAssetId, message.priceAssetId = $util.newBuffer($util.base64.length(object.priceAssetId)), 0);
                    else if (object.priceAssetId.length)
                        message.priceAssetId = object.priceAssetId;
                return message;
            };

            /**
             * Creates a plain object from an AssetPair message. Also converts values to other types if specified.
             * @function toObject
             * @memberof ExchangeTransactionData.Order.AssetPair
             * @static
             * @param {ExchangeTransactionData.Order.AssetPair} message AssetPair
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AssetPair.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.amountAssetId = "";
                    else {
                        object.amountAssetId = [];
                        if (options.bytes !== Array)
                            object.amountAssetId = $util.newBuffer(object.amountAssetId);
                    }
                    if (options.bytes === String)
                        object.priceAssetId = "";
                    else {
                        object.priceAssetId = [];
                        if (options.bytes !== Array)
                            object.priceAssetId = $util.newBuffer(object.priceAssetId);
                    }
                }
                if (message.amountAssetId != null && message.hasOwnProperty("amountAssetId"))
                    object.amountAssetId = options.bytes === String ? $util.base64.encode(message.amountAssetId, 0, message.amountAssetId.length) : options.bytes === Array ? Array.prototype.slice.call(message.amountAssetId) : message.amountAssetId;
                if (message.priceAssetId != null && message.hasOwnProperty("priceAssetId"))
                    object.priceAssetId = options.bytes === String ? $util.base64.encode(message.priceAssetId, 0, message.priceAssetId.length) : options.bytes === Array ? Array.prototype.slice.call(message.priceAssetId) : message.priceAssetId;
                return object;
            };

            /**
             * Converts this AssetPair to JSON.
             * @function toJSON
             * @memberof ExchangeTransactionData.Order.AssetPair
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AssetPair.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return AssetPair;
        })();

        return Order;
    })();

    return ExchangeTransactionData;
})();

$root.SponsorFeeTransactionData = (function() {

    /**
     * Properties of a SponsorFeeTransactionData.
     * @exports ISponsorFeeTransactionData
     * @interface ISponsorFeeTransactionData
     * @property {IAssetAmount|null} [minFee] SponsorFeeTransactionData minFee
     */

    /**
     * Constructs a new SponsorFeeTransactionData.
     * @exports SponsorFeeTransactionData
     * @classdesc Represents a SponsorFeeTransactionData.
     * @implements ISponsorFeeTransactionData
     * @constructor
     * @param {ISponsorFeeTransactionData=} [properties] Properties to set
     */
    function SponsorFeeTransactionData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SponsorFeeTransactionData minFee.
     * @member {IAssetAmount|null|undefined} minFee
     * @memberof SponsorFeeTransactionData
     * @instance
     */
    SponsorFeeTransactionData.prototype.minFee = null;

    /**
     * Creates a new SponsorFeeTransactionData instance using the specified properties.
     * @function create
     * @memberof SponsorFeeTransactionData
     * @static
     * @param {ISponsorFeeTransactionData=} [properties] Properties to set
     * @returns {SponsorFeeTransactionData} SponsorFeeTransactionData instance
     */
    SponsorFeeTransactionData.create = function create(properties) {
        return new SponsorFeeTransactionData(properties);
    };

    /**
     * Encodes the specified SponsorFeeTransactionData message. Does not implicitly {@link SponsorFeeTransactionData.verify|verify} messages.
     * @function encode
     * @memberof SponsorFeeTransactionData
     * @static
     * @param {ISponsorFeeTransactionData} message SponsorFeeTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SponsorFeeTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.minFee != null && message.hasOwnProperty("minFee"))
            $root.AssetAmount.encode(message.minFee, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified SponsorFeeTransactionData message, length delimited. Does not implicitly {@link SponsorFeeTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SponsorFeeTransactionData
     * @static
     * @param {ISponsorFeeTransactionData} message SponsorFeeTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SponsorFeeTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SponsorFeeTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof SponsorFeeTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SponsorFeeTransactionData} SponsorFeeTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SponsorFeeTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SponsorFeeTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.minFee = $root.AssetAmount.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SponsorFeeTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SponsorFeeTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SponsorFeeTransactionData} SponsorFeeTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SponsorFeeTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SponsorFeeTransactionData message.
     * @function verify
     * @memberof SponsorFeeTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SponsorFeeTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.minFee != null && message.hasOwnProperty("minFee")) {
            var error = $root.AssetAmount.verify(message.minFee);
            if (error)
                return "minFee." + error;
        }
        return null;
    };

    /**
     * Creates a SponsorFeeTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SponsorFeeTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SponsorFeeTransactionData} SponsorFeeTransactionData
     */
    SponsorFeeTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.SponsorFeeTransactionData)
            return object;
        var message = new $root.SponsorFeeTransactionData();
        if (object.minFee != null) {
            if (typeof object.minFee !== "object")
                throw TypeError(".SponsorFeeTransactionData.minFee: object expected");
            message.minFee = $root.AssetAmount.fromObject(object.minFee);
        }
        return message;
    };

    /**
     * Creates a plain object from a SponsorFeeTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SponsorFeeTransactionData
     * @static
     * @param {SponsorFeeTransactionData} message SponsorFeeTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SponsorFeeTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.minFee = null;
        if (message.minFee != null && message.hasOwnProperty("minFee"))
            object.minFee = $root.AssetAmount.toObject(message.minFee, options);
        return object;
    };

    /**
     * Converts this SponsorFeeTransactionData to JSON.
     * @function toJSON
     * @memberof SponsorFeeTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SponsorFeeTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SponsorFeeTransactionData;
})();

$root.InvokeScriptTransactionData = (function() {

    /**
     * Properties of an InvokeScriptTransactionData.
     * @exports IInvokeScriptTransactionData
     * @interface IInvokeScriptTransactionData
     * @property {Uint8Array|null} [dappAddress] InvokeScriptTransactionData dappAddress
     * @property {Uint8Array|null} [functionCall] InvokeScriptTransactionData functionCall
     * @property {Array.<IAmount>|null} [payments] InvokeScriptTransactionData payments
     */

    /**
     * Constructs a new InvokeScriptTransactionData.
     * @exports InvokeScriptTransactionData
     * @classdesc Represents an InvokeScriptTransactionData.
     * @implements IInvokeScriptTransactionData
     * @constructor
     * @param {IInvokeScriptTransactionData=} [properties] Properties to set
     */
    function InvokeScriptTransactionData(properties) {
        this.payments = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * InvokeScriptTransactionData dappAddress.
     * @member {Uint8Array} dappAddress
     * @memberof InvokeScriptTransactionData
     * @instance
     */
    InvokeScriptTransactionData.prototype.dappAddress = $util.newBuffer([]);

    /**
     * InvokeScriptTransactionData functionCall.
     * @member {Uint8Array} functionCall
     * @memberof InvokeScriptTransactionData
     * @instance
     */
    InvokeScriptTransactionData.prototype.functionCall = $util.newBuffer([]);

    /**
     * InvokeScriptTransactionData payments.
     * @member {Array.<IAmount>} payments
     * @memberof InvokeScriptTransactionData
     * @instance
     */
    InvokeScriptTransactionData.prototype.payments = $util.emptyArray;

    /**
     * Creates a new InvokeScriptTransactionData instance using the specified properties.
     * @function create
     * @memberof InvokeScriptTransactionData
     * @static
     * @param {IInvokeScriptTransactionData=} [properties] Properties to set
     * @returns {InvokeScriptTransactionData} InvokeScriptTransactionData instance
     */
    InvokeScriptTransactionData.create = function create(properties) {
        return new InvokeScriptTransactionData(properties);
    };

    /**
     * Encodes the specified InvokeScriptTransactionData message. Does not implicitly {@link InvokeScriptTransactionData.verify|verify} messages.
     * @function encode
     * @memberof InvokeScriptTransactionData
     * @static
     * @param {IInvokeScriptTransactionData} message InvokeScriptTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    InvokeScriptTransactionData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.dappAddress != null && message.hasOwnProperty("dappAddress"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.dappAddress);
        if (message.functionCall != null && message.hasOwnProperty("functionCall"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.functionCall);
        if (message.payments != null && message.payments.length)
            for (var i = 0; i < message.payments.length; ++i)
                $root.Amount.encode(message.payments[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified InvokeScriptTransactionData message, length delimited. Does not implicitly {@link InvokeScriptTransactionData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof InvokeScriptTransactionData
     * @static
     * @param {IInvokeScriptTransactionData} message InvokeScriptTransactionData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    InvokeScriptTransactionData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an InvokeScriptTransactionData message from the specified reader or buffer.
     * @function decode
     * @memberof InvokeScriptTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {InvokeScriptTransactionData} InvokeScriptTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    InvokeScriptTransactionData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.InvokeScriptTransactionData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.dappAddress = reader.bytes();
                break;
            case 2:
                message.functionCall = reader.bytes();
                break;
            case 3:
                if (!(message.payments && message.payments.length))
                    message.payments = [];
                message.payments.push($root.Amount.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an InvokeScriptTransactionData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof InvokeScriptTransactionData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {InvokeScriptTransactionData} InvokeScriptTransactionData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    InvokeScriptTransactionData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an InvokeScriptTransactionData message.
     * @function verify
     * @memberof InvokeScriptTransactionData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    InvokeScriptTransactionData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.dappAddress != null && message.hasOwnProperty("dappAddress"))
            if (!(message.dappAddress && typeof message.dappAddress.length === "number" || $util.isString(message.dappAddress)))
                return "dappAddress: buffer expected";
        if (message.functionCall != null && message.hasOwnProperty("functionCall"))
            if (!(message.functionCall && typeof message.functionCall.length === "number" || $util.isString(message.functionCall)))
                return "functionCall: buffer expected";
        if (message.payments != null && message.hasOwnProperty("payments")) {
            if (!Array.isArray(message.payments))
                return "payments: array expected";
            for (var i = 0; i < message.payments.length; ++i) {
                var error = $root.Amount.verify(message.payments[i]);
                if (error)
                    return "payments." + error;
            }
        }
        return null;
    };

    /**
     * Creates an InvokeScriptTransactionData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof InvokeScriptTransactionData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {InvokeScriptTransactionData} InvokeScriptTransactionData
     */
    InvokeScriptTransactionData.fromObject = function fromObject(object) {
        if (object instanceof $root.InvokeScriptTransactionData)
            return object;
        var message = new $root.InvokeScriptTransactionData();
        if (object.dappAddress != null)
            if (typeof object.dappAddress === "string")
                $util.base64.decode(object.dappAddress, message.dappAddress = $util.newBuffer($util.base64.length(object.dappAddress)), 0);
            else if (object.dappAddress.length)
                message.dappAddress = object.dappAddress;
        if (object.functionCall != null)
            if (typeof object.functionCall === "string")
                $util.base64.decode(object.functionCall, message.functionCall = $util.newBuffer($util.base64.length(object.functionCall)), 0);
            else if (object.functionCall.length)
                message.functionCall = object.functionCall;
        if (object.payments) {
            if (!Array.isArray(object.payments))
                throw TypeError(".InvokeScriptTransactionData.payments: array expected");
            message.payments = [];
            for (var i = 0; i < object.payments.length; ++i) {
                if (typeof object.payments[i] !== "object")
                    throw TypeError(".InvokeScriptTransactionData.payments: object expected");
                message.payments[i] = $root.Amount.fromObject(object.payments[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from an InvokeScriptTransactionData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof InvokeScriptTransactionData
     * @static
     * @param {InvokeScriptTransactionData} message InvokeScriptTransactionData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    InvokeScriptTransactionData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.payments = [];
        if (options.defaults) {
            if (options.bytes === String)
                object.dappAddress = "";
            else {
                object.dappAddress = [];
                if (options.bytes !== Array)
                    object.dappAddress = $util.newBuffer(object.dappAddress);
            }
            if (options.bytes === String)
                object.functionCall = "";
            else {
                object.functionCall = [];
                if (options.bytes !== Array)
                    object.functionCall = $util.newBuffer(object.functionCall);
            }
        }
        if (message.dappAddress != null && message.hasOwnProperty("dappAddress"))
            object.dappAddress = options.bytes === String ? $util.base64.encode(message.dappAddress, 0, message.dappAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.dappAddress) : message.dappAddress;
        if (message.functionCall != null && message.hasOwnProperty("functionCall"))
            object.functionCall = options.bytes === String ? $util.base64.encode(message.functionCall, 0, message.functionCall.length) : options.bytes === Array ? Array.prototype.slice.call(message.functionCall) : message.functionCall;
        if (message.payments && message.payments.length) {
            object.payments = [];
            for (var j = 0; j < message.payments.length; ++j)
                object.payments[j] = $root.Amount.toObject(message.payments[j], options);
        }
        return object;
    };

    /**
     * Converts this InvokeScriptTransactionData to JSON.
     * @function toJSON
     * @memberof InvokeScriptTransactionData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    InvokeScriptTransactionData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return InvokeScriptTransactionData;
})();

$root.InvokeScriptResult = (function() {

    /**
     * Properties of an InvokeScriptResult.
     * @exports IInvokeScriptResult
     * @interface IInvokeScriptResult
     * @property {Array.<DataTransactionData.IDataEntry>|null} [data] InvokeScriptResult data
     * @property {Array.<InvokeScriptResult.IPayment>|null} [transfers] InvokeScriptResult transfers
     */

    /**
     * Constructs a new InvokeScriptResult.
     * @exports InvokeScriptResult
     * @classdesc Represents an InvokeScriptResult.
     * @implements IInvokeScriptResult
     * @constructor
     * @param {IInvokeScriptResult=} [properties] Properties to set
     */
    function InvokeScriptResult(properties) {
        this.data = [];
        this.transfers = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * InvokeScriptResult data.
     * @member {Array.<DataTransactionData.IDataEntry>} data
     * @memberof InvokeScriptResult
     * @instance
     */
    InvokeScriptResult.prototype.data = $util.emptyArray;

    /**
     * InvokeScriptResult transfers.
     * @member {Array.<InvokeScriptResult.IPayment>} transfers
     * @memberof InvokeScriptResult
     * @instance
     */
    InvokeScriptResult.prototype.transfers = $util.emptyArray;

    /**
     * Creates a new InvokeScriptResult instance using the specified properties.
     * @function create
     * @memberof InvokeScriptResult
     * @static
     * @param {IInvokeScriptResult=} [properties] Properties to set
     * @returns {InvokeScriptResult} InvokeScriptResult instance
     */
    InvokeScriptResult.create = function create(properties) {
        return new InvokeScriptResult(properties);
    };

    /**
     * Encodes the specified InvokeScriptResult message. Does not implicitly {@link InvokeScriptResult.verify|verify} messages.
     * @function encode
     * @memberof InvokeScriptResult
     * @static
     * @param {IInvokeScriptResult} message InvokeScriptResult message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    InvokeScriptResult.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.data != null && message.data.length)
            for (var i = 0; i < message.data.length; ++i)
                $root.DataTransactionData.DataEntry.encode(message.data[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.transfers != null && message.transfers.length)
            for (var i = 0; i < message.transfers.length; ++i)
                $root.InvokeScriptResult.Payment.encode(message.transfers[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified InvokeScriptResult message, length delimited. Does not implicitly {@link InvokeScriptResult.verify|verify} messages.
     * @function encodeDelimited
     * @memberof InvokeScriptResult
     * @static
     * @param {IInvokeScriptResult} message InvokeScriptResult message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    InvokeScriptResult.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an InvokeScriptResult message from the specified reader or buffer.
     * @function decode
     * @memberof InvokeScriptResult
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {InvokeScriptResult} InvokeScriptResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    InvokeScriptResult.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.InvokeScriptResult();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.data && message.data.length))
                    message.data = [];
                message.data.push($root.DataTransactionData.DataEntry.decode(reader, reader.uint32()));
                break;
            case 2:
                if (!(message.transfers && message.transfers.length))
                    message.transfers = [];
                message.transfers.push($root.InvokeScriptResult.Payment.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an InvokeScriptResult message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof InvokeScriptResult
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {InvokeScriptResult} InvokeScriptResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    InvokeScriptResult.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an InvokeScriptResult message.
     * @function verify
     * @memberof InvokeScriptResult
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    InvokeScriptResult.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.data != null && message.hasOwnProperty("data")) {
            if (!Array.isArray(message.data))
                return "data: array expected";
            for (var i = 0; i < message.data.length; ++i) {
                var error = $root.DataTransactionData.DataEntry.verify(message.data[i]);
                if (error)
                    return "data." + error;
            }
        }
        if (message.transfers != null && message.hasOwnProperty("transfers")) {
            if (!Array.isArray(message.transfers))
                return "transfers: array expected";
            for (var i = 0; i < message.transfers.length; ++i) {
                var error = $root.InvokeScriptResult.Payment.verify(message.transfers[i]);
                if (error)
                    return "transfers." + error;
            }
        }
        return null;
    };

    /**
     * Creates an InvokeScriptResult message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof InvokeScriptResult
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {InvokeScriptResult} InvokeScriptResult
     */
    InvokeScriptResult.fromObject = function fromObject(object) {
        if (object instanceof $root.InvokeScriptResult)
            return object;
        var message = new $root.InvokeScriptResult();
        if (object.data) {
            if (!Array.isArray(object.data))
                throw TypeError(".InvokeScriptResult.data: array expected");
            message.data = [];
            for (var i = 0; i < object.data.length; ++i) {
                if (typeof object.data[i] !== "object")
                    throw TypeError(".InvokeScriptResult.data: object expected");
                message.data[i] = $root.DataTransactionData.DataEntry.fromObject(object.data[i]);
            }
        }
        if (object.transfers) {
            if (!Array.isArray(object.transfers))
                throw TypeError(".InvokeScriptResult.transfers: array expected");
            message.transfers = [];
            for (var i = 0; i < object.transfers.length; ++i) {
                if (typeof object.transfers[i] !== "object")
                    throw TypeError(".InvokeScriptResult.transfers: object expected");
                message.transfers[i] = $root.InvokeScriptResult.Payment.fromObject(object.transfers[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from an InvokeScriptResult message. Also converts values to other types if specified.
     * @function toObject
     * @memberof InvokeScriptResult
     * @static
     * @param {InvokeScriptResult} message InvokeScriptResult
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    InvokeScriptResult.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults) {
            object.data = [];
            object.transfers = [];
        }
        if (message.data && message.data.length) {
            object.data = [];
            for (var j = 0; j < message.data.length; ++j)
                object.data[j] = $root.DataTransactionData.DataEntry.toObject(message.data[j], options);
        }
        if (message.transfers && message.transfers.length) {
            object.transfers = [];
            for (var j = 0; j < message.transfers.length; ++j)
                object.transfers[j] = $root.InvokeScriptResult.Payment.toObject(message.transfers[j], options);
        }
        return object;
    };

    /**
     * Converts this InvokeScriptResult to JSON.
     * @function toJSON
     * @memberof InvokeScriptResult
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    InvokeScriptResult.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    InvokeScriptResult.Payment = (function() {

        /**
         * Properties of a Payment.
         * @memberof InvokeScriptResult
         * @interface IPayment
         * @property {Uint8Array|null} [address] Payment address
         * @property {IAmount|null} [amount] Payment amount
         */

        /**
         * Constructs a new Payment.
         * @memberof InvokeScriptResult
         * @classdesc Represents a Payment.
         * @implements IPayment
         * @constructor
         * @param {InvokeScriptResult.IPayment=} [properties] Properties to set
         */
        function Payment(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Payment address.
         * @member {Uint8Array} address
         * @memberof InvokeScriptResult.Payment
         * @instance
         */
        Payment.prototype.address = $util.newBuffer([]);

        /**
         * Payment amount.
         * @member {IAmount|null|undefined} amount
         * @memberof InvokeScriptResult.Payment
         * @instance
         */
        Payment.prototype.amount = null;

        /**
         * Creates a new Payment instance using the specified properties.
         * @function create
         * @memberof InvokeScriptResult.Payment
         * @static
         * @param {InvokeScriptResult.IPayment=} [properties] Properties to set
         * @returns {InvokeScriptResult.Payment} Payment instance
         */
        Payment.create = function create(properties) {
            return new Payment(properties);
        };

        /**
         * Encodes the specified Payment message. Does not implicitly {@link InvokeScriptResult.Payment.verify|verify} messages.
         * @function encode
         * @memberof InvokeScriptResult.Payment
         * @static
         * @param {InvokeScriptResult.IPayment} message Payment message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Payment.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.address != null && message.hasOwnProperty("address"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.address);
            if (message.amount != null && message.hasOwnProperty("amount"))
                $root.Amount.encode(message.amount, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Payment message, length delimited. Does not implicitly {@link InvokeScriptResult.Payment.verify|verify} messages.
         * @function encodeDelimited
         * @memberof InvokeScriptResult.Payment
         * @static
         * @param {InvokeScriptResult.IPayment} message Payment message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Payment.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Payment message from the specified reader or buffer.
         * @function decode
         * @memberof InvokeScriptResult.Payment
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {InvokeScriptResult.Payment} Payment
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Payment.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.InvokeScriptResult.Payment();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.address = reader.bytes();
                    break;
                case 2:
                    message.amount = $root.Amount.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Payment message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof InvokeScriptResult.Payment
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {InvokeScriptResult.Payment} Payment
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Payment.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Payment message.
         * @function verify
         * @memberof InvokeScriptResult.Payment
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Payment.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.address != null && message.hasOwnProperty("address"))
                if (!(message.address && typeof message.address.length === "number" || $util.isString(message.address)))
                    return "address: buffer expected";
            if (message.amount != null && message.hasOwnProperty("amount")) {
                var error = $root.Amount.verify(message.amount);
                if (error)
                    return "amount." + error;
            }
            return null;
        };

        /**
         * Creates a Payment message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof InvokeScriptResult.Payment
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {InvokeScriptResult.Payment} Payment
         */
        Payment.fromObject = function fromObject(object) {
            if (object instanceof $root.InvokeScriptResult.Payment)
                return object;
            var message = new $root.InvokeScriptResult.Payment();
            if (object.address != null)
                if (typeof object.address === "string")
                    $util.base64.decode(object.address, message.address = $util.newBuffer($util.base64.length(object.address)), 0);
                else if (object.address.length)
                    message.address = object.address;
            if (object.amount != null) {
                if (typeof object.amount !== "object")
                    throw TypeError(".InvokeScriptResult.Payment.amount: object expected");
                message.amount = $root.Amount.fromObject(object.amount);
            }
            return message;
        };

        /**
         * Creates a plain object from a Payment message. Also converts values to other types if specified.
         * @function toObject
         * @memberof InvokeScriptResult.Payment
         * @static
         * @param {InvokeScriptResult.Payment} message Payment
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Payment.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.address = "";
                else {
                    object.address = [];
                    if (options.bytes !== Array)
                        object.address = $util.newBuffer(object.address);
                }
                object.amount = null;
            }
            if (message.address != null && message.hasOwnProperty("address"))
                object.address = options.bytes === String ? $util.base64.encode(message.address, 0, message.address.length) : options.bytes === Array ? Array.prototype.slice.call(message.address) : message.address;
            if (message.amount != null && message.hasOwnProperty("amount"))
                object.amount = $root.Amount.toObject(message.amount, options);
            return object;
        };

        /**
         * Converts this Payment to JSON.
         * @function toJSON
         * @memberof InvokeScriptResult.Payment
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Payment.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Payment;
    })();

    return InvokeScriptResult;
})();

$root.Script = (function() {

    /**
     * Properties of a Script.
     * @exports IScript
     * @interface IScript
     * @property {Uint8Array|null} [bytes] Script bytes
     */

    /**
     * Constructs a new Script.
     * @exports Script
     * @classdesc Represents a Script.
     * @implements IScript
     * @constructor
     * @param {IScript=} [properties] Properties to set
     */
    function Script(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Script bytes.
     * @member {Uint8Array} bytes
     * @memberof Script
     * @instance
     */
    Script.prototype.bytes = $util.newBuffer([]);

    /**
     * Creates a new Script instance using the specified properties.
     * @function create
     * @memberof Script
     * @static
     * @param {IScript=} [properties] Properties to set
     * @returns {Script} Script instance
     */
    Script.create = function create(properties) {
        return new Script(properties);
    };

    /**
     * Encodes the specified Script message. Does not implicitly {@link Script.verify|verify} messages.
     * @function encode
     * @memberof Script
     * @static
     * @param {IScript} message Script message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Script.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.bytes != null && message.hasOwnProperty("bytes"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.bytes);
        return writer;
    };

    /**
     * Encodes the specified Script message, length delimited. Does not implicitly {@link Script.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Script
     * @static
     * @param {IScript} message Script message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Script.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Script message from the specified reader or buffer.
     * @function decode
     * @memberof Script
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Script} Script
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Script.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Script();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.bytes = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Script message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Script
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Script} Script
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Script.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Script message.
     * @function verify
     * @memberof Script
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Script.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.bytes != null && message.hasOwnProperty("bytes"))
            if (!(message.bytes && typeof message.bytes.length === "number" || $util.isString(message.bytes)))
                return "bytes: buffer expected";
        return null;
    };

    /**
     * Creates a Script message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Script
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Script} Script
     */
    Script.fromObject = function fromObject(object) {
        if (object instanceof $root.Script)
            return object;
        var message = new $root.Script();
        if (object.bytes != null)
            if (typeof object.bytes === "string")
                $util.base64.decode(object.bytes, message.bytes = $util.newBuffer($util.base64.length(object.bytes)), 0);
            else if (object.bytes.length)
                message.bytes = object.bytes;
        return message;
    };

    /**
     * Creates a plain object from a Script message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Script
     * @static
     * @param {Script} message Script
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Script.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            if (options.bytes === String)
                object.bytes = "";
            else {
                object.bytes = [];
                if (options.bytes !== Array)
                    object.bytes = $util.newBuffer(object.bytes);
            }
        if (message.bytes != null && message.hasOwnProperty("bytes"))
            object.bytes = options.bytes === String ? $util.base64.encode(message.bytes, 0, message.bytes.length) : options.bytes === Array ? Array.prototype.slice.call(message.bytes) : message.bytes;
        return object;
    };

    /**
     * Converts this Script to JSON.
     * @function toJSON
     * @memberof Script
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Script.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Script;
})();

$root.Recipient = (function() {

    /**
     * Properties of a Recipient.
     * @exports IRecipient
     * @interface IRecipient
     * @property {Uint8Array|null} [address] Recipient address
     * @property {string|null} [alias] Recipient alias
     */

    /**
     * Constructs a new Recipient.
     * @exports Recipient
     * @classdesc Represents a Recipient.
     * @implements IRecipient
     * @constructor
     * @param {IRecipient=} [properties] Properties to set
     */
    function Recipient(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Recipient address.
     * @member {Uint8Array} address
     * @memberof Recipient
     * @instance
     */
    Recipient.prototype.address = $util.newBuffer([]);

    /**
     * Recipient alias.
     * @member {string} alias
     * @memberof Recipient
     * @instance
     */
    Recipient.prototype.alias = "";

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * Recipient recipient.
     * @member {"address"|"alias"|undefined} recipient
     * @memberof Recipient
     * @instance
     */
    Object.defineProperty(Recipient.prototype, "recipient", {
        get: $util.oneOfGetter($oneOfFields = ["address", "alias"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Recipient instance using the specified properties.
     * @function create
     * @memberof Recipient
     * @static
     * @param {IRecipient=} [properties] Properties to set
     * @returns {Recipient} Recipient instance
     */
    Recipient.create = function create(properties) {
        return new Recipient(properties);
    };

    /**
     * Encodes the specified Recipient message. Does not implicitly {@link Recipient.verify|verify} messages.
     * @function encode
     * @memberof Recipient
     * @static
     * @param {IRecipient} message Recipient message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Recipient.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.address != null && message.hasOwnProperty("address"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.address);
        if (message.alias != null && message.hasOwnProperty("alias"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.alias);
        return writer;
    };

    /**
     * Encodes the specified Recipient message, length delimited. Does not implicitly {@link Recipient.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Recipient
     * @static
     * @param {IRecipient} message Recipient message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Recipient.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Recipient message from the specified reader or buffer.
     * @function decode
     * @memberof Recipient
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Recipient} Recipient
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Recipient.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Recipient();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.address = reader.bytes();
                break;
            case 2:
                message.alias = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Recipient message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Recipient
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Recipient} Recipient
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Recipient.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Recipient message.
     * @function verify
     * @memberof Recipient
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Recipient.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.address != null && message.hasOwnProperty("address")) {
            properties.recipient = 1;
            if (!(message.address && typeof message.address.length === "number" || $util.isString(message.address)))
                return "address: buffer expected";
        }
        if (message.alias != null && message.hasOwnProperty("alias")) {
            if (properties.recipient === 1)
                return "recipient: multiple values";
            properties.recipient = 1;
            if (!$util.isString(message.alias))
                return "alias: string expected";
        }
        return null;
    };

    /**
     * Creates a Recipient message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Recipient
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Recipient} Recipient
     */
    Recipient.fromObject = function fromObject(object) {
        if (object instanceof $root.Recipient)
            return object;
        var message = new $root.Recipient();
        if (object.address != null)
            if (typeof object.address === "string")
                $util.base64.decode(object.address, message.address = $util.newBuffer($util.base64.length(object.address)), 0);
            else if (object.address.length)
                message.address = object.address;
        if (object.alias != null)
            message.alias = String(object.alias);
        return message;
    };

    /**
     * Creates a plain object from a Recipient message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Recipient
     * @static
     * @param {Recipient} message Recipient
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Recipient.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.address != null && message.hasOwnProperty("address")) {
            object.address = options.bytes === String ? $util.base64.encode(message.address, 0, message.address.length) : options.bytes === Array ? Array.prototype.slice.call(message.address) : message.address;
            if (options.oneofs)
                object.recipient = "address";
        }
        if (message.alias != null && message.hasOwnProperty("alias")) {
            object.alias = message.alias;
            if (options.oneofs)
                object.recipient = "alias";
        }
        return object;
    };

    /**
     * Converts this Recipient to JSON.
     * @function toJSON
     * @memberof Recipient
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Recipient.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Recipient;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Empty = (function() {

            /**
             * Properties of an Empty.
             * @memberof google.protobuf
             * @interface IEmpty
             */

            /**
             * Constructs a new Empty.
             * @memberof google.protobuf
             * @classdesc Represents an Empty.
             * @implements IEmpty
             * @constructor
             * @param {google.protobuf.IEmpty=} [properties] Properties to set
             */
            function Empty(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new Empty instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Empty
             * @static
             * @param {google.protobuf.IEmpty=} [properties] Properties to set
             * @returns {google.protobuf.Empty} Empty instance
             */
            Empty.create = function create(properties) {
                return new Empty(properties);
            };

            /**
             * Encodes the specified Empty message. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Empty
             * @static
             * @param {google.protobuf.IEmpty} message Empty message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Empty.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified Empty message, length delimited. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Empty
             * @static
             * @param {google.protobuf.IEmpty} message Empty message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Empty.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Empty message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Empty
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Empty} Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Empty.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Empty();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Empty message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Empty
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Empty} Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Empty.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Empty message.
             * @function verify
             * @memberof google.protobuf.Empty
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Empty.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates an Empty message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Empty
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Empty} Empty
             */
            Empty.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Empty)
                    return object;
                return new $root.google.protobuf.Empty();
            };

            /**
             * Creates a plain object from an Empty message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Empty
             * @static
             * @param {google.protobuf.Empty} message Empty
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Empty.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this Empty to JSON.
             * @function toJSON
             * @memberof google.protobuf.Empty
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Empty.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Empty;
        })();

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
