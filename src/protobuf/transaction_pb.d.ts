// package: 
// file: transaction.proto

/* tslint:disable */

import * as jspb from "google-protobuf";
import * as script_pb from "./script_pb";
import * as recipient_pb from "./recipient_pb";

export class AssetAmount extends jspb.Message { 
    getAssetId(): Uint8Array | string;
    getAssetId_asU8(): Uint8Array;
    getAssetId_asB64(): string;
    setAssetId(value: Uint8Array | string): void;

    getAmount(): number;
    setAmount(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AssetAmount.AsObject;
    static toObject(includeInstance: boolean, msg: AssetAmount): AssetAmount.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AssetAmount, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AssetAmount;
    static deserializeBinaryFromReader(message: AssetAmount, reader: jspb.BinaryReader): AssetAmount;
}

export namespace AssetAmount {
    export type AsObject = {
        assetId: Uint8Array | string,
        amount: number,
    }
}

export class Amount extends jspb.Message { 

    hasWavesAmount(): boolean;
    clearWavesAmount(): void;
    getWavesAmount(): number;
    setWavesAmount(value: number): void;


    hasAssetAmount(): boolean;
    clearAssetAmount(): void;
    getAssetAmount(): AssetAmount | undefined;
    setAssetAmount(value?: AssetAmount): void;


    getAmountCase(): Amount.AmountCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Amount.AsObject;
    static toObject(includeInstance: boolean, msg: Amount): Amount.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Amount, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Amount;
    static deserializeBinaryFromReader(message: Amount, reader: jspb.BinaryReader): Amount;
}

export namespace Amount {
    export type AsObject = {
        wavesAmount: number,
        assetAmount?: AssetAmount.AsObject,
    }

    export enum AmountCase {
        AMOUNT_NOT_SET = 0,
    
    WAVES_AMOUNT = 1,

    ASSET_AMOUNT = 2,

    }

}

export class SignedTransaction extends jspb.Message { 

    hasTransaction(): boolean;
    clearTransaction(): void;
    getTransaction(): Transaction | undefined;
    setTransaction(value?: Transaction): void;

    clearProofsList(): void;
    getProofsList(): Array<Uint8Array | string>;
    getProofsList_asU8(): Array<Uint8Array>;
    getProofsList_asB64(): Array<string>;
    setProofsList(value: Array<Uint8Array | string>): void;
    addProofs(value: Uint8Array | string, index?: number): Uint8Array | string;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SignedTransaction.AsObject;
    static toObject(includeInstance: boolean, msg: SignedTransaction): SignedTransaction.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SignedTransaction, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SignedTransaction;
    static deserializeBinaryFromReader(message: SignedTransaction, reader: jspb.BinaryReader): SignedTransaction;
}

export namespace SignedTransaction {
    export type AsObject = {
        transaction?: Transaction.AsObject,
        proofsList: Array<Uint8Array | string>,
    }
}

export class Transaction extends jspb.Message { 
    getChainId(): number;
    setChainId(value: number): void;

    getSenderPublicKey(): Uint8Array | string;
    getSenderPublicKey_asU8(): Uint8Array;
    getSenderPublicKey_asB64(): string;
    setSenderPublicKey(value: Uint8Array | string): void;


    hasFee(): boolean;
    clearFee(): void;
    getFee(): Amount | undefined;
    setFee(value?: Amount): void;

    getTimestamp(): number;
    setTimestamp(value: number): void;

    getVersion(): number;
    setVersion(value: number): void;


    hasGenesis(): boolean;
    clearGenesis(): void;
    getGenesis(): GenesisTransactionData | undefined;
    setGenesis(value?: GenesisTransactionData): void;


    hasPayment(): boolean;
    clearPayment(): void;
    getPayment(): PaymentTransactionData | undefined;
    setPayment(value?: PaymentTransactionData): void;


    hasIssue(): boolean;
    clearIssue(): void;
    getIssue(): IssueTransactionData | undefined;
    setIssue(value?: IssueTransactionData): void;


    hasTransfer(): boolean;
    clearTransfer(): void;
    getTransfer(): TransferTransactionData | undefined;
    setTransfer(value?: TransferTransactionData): void;


    hasReissue(): boolean;
    clearReissue(): void;
    getReissue(): ReissueTransactionData | undefined;
    setReissue(value?: ReissueTransactionData): void;


    hasBurn(): boolean;
    clearBurn(): void;
    getBurn(): BurnTransactionData | undefined;
    setBurn(value?: BurnTransactionData): void;


    hasExchange(): boolean;
    clearExchange(): void;
    getExchange(): ExchangeTransactionData | undefined;
    setExchange(value?: ExchangeTransactionData): void;


    hasLease(): boolean;
    clearLease(): void;
    getLease(): LeaseTransactionData | undefined;
    setLease(value?: LeaseTransactionData): void;


    hasLeaseCancel(): boolean;
    clearLeaseCancel(): void;
    getLeaseCancel(): LeaseCancelTransactionData | undefined;
    setLeaseCancel(value?: LeaseCancelTransactionData): void;


    hasCreateAlias(): boolean;
    clearCreateAlias(): void;
    getCreateAlias(): CreateAliasTransactionData | undefined;
    setCreateAlias(value?: CreateAliasTransactionData): void;


    hasMassTransfer(): boolean;
    clearMassTransfer(): void;
    getMassTransfer(): MassTransferTransactionData | undefined;
    setMassTransfer(value?: MassTransferTransactionData): void;


    hasDataTransaction(): boolean;
    clearDataTransaction(): void;
    getDataTransaction(): DataTransactionData | undefined;
    setDataTransaction(value?: DataTransactionData): void;


    hasSetScript(): boolean;
    clearSetScript(): void;
    getSetScript(): SetScriptTransactionData | undefined;
    setSetScript(value?: SetScriptTransactionData): void;


    hasSponsorFee(): boolean;
    clearSponsorFee(): void;
    getSponsorFee(): SponsorFeeTransactionData | undefined;
    setSponsorFee(value?: SponsorFeeTransactionData): void;


    hasSetAssetScript(): boolean;
    clearSetAssetScript(): void;
    getSetAssetScript(): SetAssetScriptTransactionData | undefined;
    setSetAssetScript(value?: SetAssetScriptTransactionData): void;


    getDataCase(): Transaction.DataCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Transaction.AsObject;
    static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Transaction;
    static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
    export type AsObject = {
        chainId: number,
        senderPublicKey: Uint8Array | string,
        fee?: Amount.AsObject,
        timestamp: number,
        version: number,
        genesis?: GenesisTransactionData.AsObject,
        payment?: PaymentTransactionData.AsObject,
        issue?: IssueTransactionData.AsObject,
        transfer?: TransferTransactionData.AsObject,
        reissue?: ReissueTransactionData.AsObject,
        burn?: BurnTransactionData.AsObject,
        exchange?: ExchangeTransactionData.AsObject,
        lease?: LeaseTransactionData.AsObject,
        leaseCancel?: LeaseCancelTransactionData.AsObject,
        createAlias?: CreateAliasTransactionData.AsObject,
        massTransfer?: MassTransferTransactionData.AsObject,
        dataTransaction?: DataTransactionData.AsObject,
        setScript?: SetScriptTransactionData.AsObject,
        sponsorFee?: SponsorFeeTransactionData.AsObject,
        setAssetScript?: SetAssetScriptTransactionData.AsObject,
    }

    export enum DataCase {
        DATA_NOT_SET = 0,
    
    GENESIS = 101,

    PAYMENT = 102,

    ISSUE = 103,

    TRANSFER = 104,

    REISSUE = 105,

    BURN = 106,

    EXCHANGE = 107,

    LEASE = 108,

    LEASE_CANCEL = 109,

    CREATE_ALIAS = 110,

    MASS_TRANSFER = 111,

    DATA_TRANSACTION = 112,

    SET_SCRIPT = 113,

    SPONSOR_FEE = 114,

    SET_ASSET_SCRIPT = 115,

    }

}

export class GenesisTransactionData extends jspb.Message { 
    getRecipientAddress(): Uint8Array | string;
    getRecipientAddress_asU8(): Uint8Array;
    getRecipientAddress_asB64(): string;
    setRecipientAddress(value: Uint8Array | string): void;

    getAmount(): number;
    setAmount(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GenesisTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: GenesisTransactionData): GenesisTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GenesisTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GenesisTransactionData;
    static deserializeBinaryFromReader(message: GenesisTransactionData, reader: jspb.BinaryReader): GenesisTransactionData;
}

export namespace GenesisTransactionData {
    export type AsObject = {
        recipientAddress: Uint8Array | string,
        amount: number,
    }
}

export class PaymentTransactionData extends jspb.Message { 
    getRecipientAddress(): Uint8Array | string;
    getRecipientAddress_asU8(): Uint8Array;
    getRecipientAddress_asB64(): string;
    setRecipientAddress(value: Uint8Array | string): void;

    getAmount(): number;
    setAmount(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PaymentTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: PaymentTransactionData): PaymentTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PaymentTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PaymentTransactionData;
    static deserializeBinaryFromReader(message: PaymentTransactionData, reader: jspb.BinaryReader): PaymentTransactionData;
}

export namespace PaymentTransactionData {
    export type AsObject = {
        recipientAddress: Uint8Array | string,
        amount: number,
    }
}

export class TransferTransactionData extends jspb.Message { 

    hasRecipient(): boolean;
    clearRecipient(): void;
    getRecipient(): recipient_pb.Recipient | undefined;
    setRecipient(value?: recipient_pb.Recipient): void;


    hasAmount(): boolean;
    clearAmount(): void;
    getAmount(): Amount | undefined;
    setAmount(value?: Amount): void;

    getAttachment(): Uint8Array | string;
    getAttachment_asU8(): Uint8Array;
    getAttachment_asB64(): string;
    setAttachment(value: Uint8Array | string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TransferTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: TransferTransactionData): TransferTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TransferTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TransferTransactionData;
    static deserializeBinaryFromReader(message: TransferTransactionData, reader: jspb.BinaryReader): TransferTransactionData;
}

export namespace TransferTransactionData {
    export type AsObject = {
        recipient?: recipient_pb.Recipient.AsObject,
        amount?: Amount.AsObject,
        attachment: Uint8Array | string,
    }
}

export class CreateAliasTransactionData extends jspb.Message { 
    getAlias(): string;
    setAlias(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateAliasTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: CreateAliasTransactionData): CreateAliasTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateAliasTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateAliasTransactionData;
    static deserializeBinaryFromReader(message: CreateAliasTransactionData, reader: jspb.BinaryReader): CreateAliasTransactionData;
}

export namespace CreateAliasTransactionData {
    export type AsObject = {
        alias: string,
    }
}

export class DataTransactionData extends jspb.Message { 
    clearDataList(): void;
    getDataList(): Array<DataTransactionData.DataEntry>;
    setDataList(value: Array<DataTransactionData.DataEntry>): void;
    addData(value?: DataTransactionData.DataEntry, index?: number): DataTransactionData.DataEntry;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DataTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: DataTransactionData): DataTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DataTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DataTransactionData;
    static deserializeBinaryFromReader(message: DataTransactionData, reader: jspb.BinaryReader): DataTransactionData;
}

export namespace DataTransactionData {
    export type AsObject = {
        dataList: Array<DataTransactionData.DataEntry.AsObject>,
    }


    export class DataEntry extends jspb.Message { 
    getKey(): string;
    setKey(value: string): void;


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

}

export class MassTransferTransactionData extends jspb.Message { 
    getAssetId(): Uint8Array | string;
    getAssetId_asU8(): Uint8Array;
    getAssetId_asB64(): string;
    setAssetId(value: Uint8Array | string): void;

    clearTransfersList(): void;
    getTransfersList(): Array<MassTransferTransactionData.Transfer>;
    setTransfersList(value: Array<MassTransferTransactionData.Transfer>): void;
    addTransfers(value?: MassTransferTransactionData.Transfer, index?: number): MassTransferTransactionData.Transfer;

    getAttachment(): Uint8Array | string;
    getAttachment_asU8(): Uint8Array;
    getAttachment_asB64(): string;
    setAttachment(value: Uint8Array | string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MassTransferTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: MassTransferTransactionData): MassTransferTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MassTransferTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MassTransferTransactionData;
    static deserializeBinaryFromReader(message: MassTransferTransactionData, reader: jspb.BinaryReader): MassTransferTransactionData;
}

export namespace MassTransferTransactionData {
    export type AsObject = {
        assetId: Uint8Array | string,
        transfersList: Array<MassTransferTransactionData.Transfer.AsObject>,
        attachment: Uint8Array | string,
    }


    export class Transfer extends jspb.Message { 

    hasAddress(): boolean;
    clearAddress(): void;
    getAddress(): recipient_pb.Recipient | undefined;
    setAddress(value?: recipient_pb.Recipient): void;

    getAmount(): number;
    setAmount(value: number): void;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): Transfer.AsObject;
        static toObject(includeInstance: boolean, msg: Transfer): Transfer.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: Transfer, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): Transfer;
        static deserializeBinaryFromReader(message: Transfer, reader: jspb.BinaryReader): Transfer;
    }

    export namespace Transfer {
        export type AsObject = {
        address?: recipient_pb.Recipient.AsObject,
        amount: number,
        }
    }

}

export class LeaseTransactionData extends jspb.Message { 

    hasRecipient(): boolean;
    clearRecipient(): void;
    getRecipient(): recipient_pb.Recipient | undefined;
    setRecipient(value?: recipient_pb.Recipient): void;

    getAmount(): number;
    setAmount(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LeaseTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: LeaseTransactionData): LeaseTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LeaseTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LeaseTransactionData;
    static deserializeBinaryFromReader(message: LeaseTransactionData, reader: jspb.BinaryReader): LeaseTransactionData;
}

export namespace LeaseTransactionData {
    export type AsObject = {
        recipient?: recipient_pb.Recipient.AsObject,
        amount: number,
    }
}

export class LeaseCancelTransactionData extends jspb.Message { 
    getLeaseId(): Uint8Array | string;
    getLeaseId_asU8(): Uint8Array;
    getLeaseId_asB64(): string;
    setLeaseId(value: Uint8Array | string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LeaseCancelTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: LeaseCancelTransactionData): LeaseCancelTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LeaseCancelTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LeaseCancelTransactionData;
    static deserializeBinaryFromReader(message: LeaseCancelTransactionData, reader: jspb.BinaryReader): LeaseCancelTransactionData;
}

export namespace LeaseCancelTransactionData {
    export type AsObject = {
        leaseId: Uint8Array | string,
    }
}

export class BurnTransactionData extends jspb.Message { 

    hasAssetAmount(): boolean;
    clearAssetAmount(): void;
    getAssetAmount(): AssetAmount | undefined;
    setAssetAmount(value?: AssetAmount): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BurnTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: BurnTransactionData): BurnTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BurnTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BurnTransactionData;
    static deserializeBinaryFromReader(message: BurnTransactionData, reader: jspb.BinaryReader): BurnTransactionData;
}

export namespace BurnTransactionData {
    export type AsObject = {
        assetAmount?: AssetAmount.AsObject,
    }
}

export class IssueTransactionData extends jspb.Message { 
    getName(): Uint8Array | string;
    getName_asU8(): Uint8Array;
    getName_asB64(): string;
    setName(value: Uint8Array | string): void;

    getDescription(): Uint8Array | string;
    getDescription_asU8(): Uint8Array;
    getDescription_asB64(): string;
    setDescription(value: Uint8Array | string): void;

    getAmount(): number;
    setAmount(value: number): void;

    getDecimals(): number;
    setDecimals(value: number): void;

    getReissuable(): boolean;
    setReissuable(value: boolean): void;


    hasScript(): boolean;
    clearScript(): void;
    getScript(): script_pb.Script | undefined;
    setScript(value?: script_pb.Script): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): IssueTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: IssueTransactionData): IssueTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: IssueTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): IssueTransactionData;
    static deserializeBinaryFromReader(message: IssueTransactionData, reader: jspb.BinaryReader): IssueTransactionData;
}

export namespace IssueTransactionData {
    export type AsObject = {
        name: Uint8Array | string,
        description: Uint8Array | string,
        amount: number,
        decimals: number,
        reissuable: boolean,
        script?: script_pb.Script.AsObject,
    }
}

export class ReissueTransactionData extends jspb.Message { 

    hasAssetAmount(): boolean;
    clearAssetAmount(): void;
    getAssetAmount(): AssetAmount | undefined;
    setAssetAmount(value?: AssetAmount): void;

    getReissuable(): boolean;
    setReissuable(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ReissueTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: ReissueTransactionData): ReissueTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ReissueTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ReissueTransactionData;
    static deserializeBinaryFromReader(message: ReissueTransactionData, reader: jspb.BinaryReader): ReissueTransactionData;
}

export namespace ReissueTransactionData {
    export type AsObject = {
        assetAmount?: AssetAmount.AsObject,
        reissuable: boolean,
    }
}

export class SetAssetScriptTransactionData extends jspb.Message { 
    getAssetId(): Uint8Array | string;
    getAssetId_asU8(): Uint8Array;
    getAssetId_asB64(): string;
    setAssetId(value: Uint8Array | string): void;


    hasScript(): boolean;
    clearScript(): void;
    getScript(): script_pb.Script | undefined;
    setScript(value?: script_pb.Script): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetAssetScriptTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: SetAssetScriptTransactionData): SetAssetScriptTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SetAssetScriptTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SetAssetScriptTransactionData;
    static deserializeBinaryFromReader(message: SetAssetScriptTransactionData, reader: jspb.BinaryReader): SetAssetScriptTransactionData;
}

export namespace SetAssetScriptTransactionData {
    export type AsObject = {
        assetId: Uint8Array | string,
        script?: script_pb.Script.AsObject,
    }
}

export class SetScriptTransactionData extends jspb.Message { 

    hasScript(): boolean;
    clearScript(): void;
    getScript(): script_pb.Script | undefined;
    setScript(value?: script_pb.Script): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetScriptTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: SetScriptTransactionData): SetScriptTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SetScriptTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SetScriptTransactionData;
    static deserializeBinaryFromReader(message: SetScriptTransactionData, reader: jspb.BinaryReader): SetScriptTransactionData;
}

export namespace SetScriptTransactionData {
    export type AsObject = {
        script?: script_pb.Script.AsObject,
    }
}

export class ExchangeTransactionData extends jspb.Message { 

    hasBuySellOrders(): boolean;
    clearBuySellOrders(): void;
    getBuySellOrders(): ExchangeTransactionData.BuySellOrders | undefined;
    setBuySellOrders(value?: ExchangeTransactionData.BuySellOrders): void;


    hasMakerTakerOrders(): boolean;
    clearMakerTakerOrders(): void;
    getMakerTakerOrders(): ExchangeTransactionData.MakerTakerOrders | undefined;
    setMakerTakerOrders(value?: ExchangeTransactionData.MakerTakerOrders): void;

    getAmount(): number;
    setAmount(value: number): void;

    getPrice(): number;
    setPrice(value: number): void;

    getBuyMatcherFee(): number;
    setBuyMatcherFee(value: number): void;

    getSellMatcherFee(): number;
    setSellMatcherFee(value: number): void;


    getOrdersCase(): ExchangeTransactionData.OrdersCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExchangeTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: ExchangeTransactionData): ExchangeTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExchangeTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExchangeTransactionData;
    static deserializeBinaryFromReader(message: ExchangeTransactionData, reader: jspb.BinaryReader): ExchangeTransactionData;
}

export namespace ExchangeTransactionData {
    export type AsObject = {
        buySellOrders?: ExchangeTransactionData.BuySellOrders.AsObject,
        makerTakerOrders?: ExchangeTransactionData.MakerTakerOrders.AsObject,
        amount: number,
        price: number,
        buyMatcherFee: number,
        sellMatcherFee: number,
    }


    export class BuySellOrders extends jspb.Message { 

    hasBuyOrder(): boolean;
    clearBuyOrder(): void;
    getBuyOrder(): ExchangeTransactionData.Order | undefined;
    setBuyOrder(value?: ExchangeTransactionData.Order): void;


    hasSellOrder(): boolean;
    clearSellOrder(): void;
    getSellOrder(): ExchangeTransactionData.Order | undefined;
    setSellOrder(value?: ExchangeTransactionData.Order): void;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): BuySellOrders.AsObject;
        static toObject(includeInstance: boolean, msg: BuySellOrders): BuySellOrders.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: BuySellOrders, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): BuySellOrders;
        static deserializeBinaryFromReader(message: BuySellOrders, reader: jspb.BinaryReader): BuySellOrders;
    }

    export namespace BuySellOrders {
        export type AsObject = {
        buyOrder?: ExchangeTransactionData.Order.AsObject,
        sellOrder?: ExchangeTransactionData.Order.AsObject,
        }
    }

    export class MakerTakerOrders extends jspb.Message { 

    hasMakerOrder(): boolean;
    clearMakerOrder(): void;
    getMakerOrder(): ExchangeTransactionData.Order | undefined;
    setMakerOrder(value?: ExchangeTransactionData.Order): void;


    hasTakerOrder(): boolean;
    clearTakerOrder(): void;
    getTakerOrder(): ExchangeTransactionData.Order | undefined;
    setTakerOrder(value?: ExchangeTransactionData.Order): void;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): MakerTakerOrders.AsObject;
        static toObject(includeInstance: boolean, msg: MakerTakerOrders): MakerTakerOrders.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: MakerTakerOrders, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): MakerTakerOrders;
        static deserializeBinaryFromReader(message: MakerTakerOrders, reader: jspb.BinaryReader): MakerTakerOrders;
    }

    export namespace MakerTakerOrders {
        export type AsObject = {
        makerOrder?: ExchangeTransactionData.Order.AsObject,
        takerOrder?: ExchangeTransactionData.Order.AsObject,
        }
    }

    export class Order extends jspb.Message { 
    getChainId(): number;
    setChainId(value: number): void;

    getSenderPublicKey(): Uint8Array | string;
    getSenderPublicKey_asU8(): Uint8Array;
    getSenderPublicKey_asB64(): string;
    setSenderPublicKey(value: Uint8Array | string): void;

    getMatcherPublicKey(): Uint8Array | string;
    getMatcherPublicKey_asU8(): Uint8Array;
    getMatcherPublicKey_asB64(): string;
    setMatcherPublicKey(value: Uint8Array | string): void;


    hasAssetPair(): boolean;
    clearAssetPair(): void;
    getAssetPair(): ExchangeTransactionData.Order.AssetPair | undefined;
    setAssetPair(value?: ExchangeTransactionData.Order.AssetPair): void;

    getOrderSide(): ExchangeTransactionData.Order.Side;
    setOrderSide(value: ExchangeTransactionData.Order.Side): void;

    getAmount(): number;
    setAmount(value: number): void;

    getPrice(): number;
    setPrice(value: number): void;

    getTimestamp(): number;
    setTimestamp(value: number): void;

    getExpiration(): number;
    setExpiration(value: number): void;


    hasMatcherFee(): boolean;
    clearMatcherFee(): void;
    getMatcherFee(): Amount | undefined;
    setMatcherFee(value?: Amount): void;

    getVersion(): number;
    setVersion(value: number): void;

    clearProofsList(): void;
    getProofsList(): Array<Uint8Array | string>;
    getProofsList_asU8(): Array<Uint8Array>;
    getProofsList_asB64(): Array<string>;
    setProofsList(value: Array<Uint8Array | string>): void;
    addProofs(value: Uint8Array | string, index?: number): Uint8Array | string;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): Order.AsObject;
        static toObject(includeInstance: boolean, msg: Order): Order.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: Order, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): Order;
        static deserializeBinaryFromReader(message: Order, reader: jspb.BinaryReader): Order;
    }

    export namespace Order {
        export type AsObject = {
        chainId: number,
        senderPublicKey: Uint8Array | string,
        matcherPublicKey: Uint8Array | string,
        assetPair?: ExchangeTransactionData.Order.AssetPair.AsObject,
        orderSide: ExchangeTransactionData.Order.Side,
        amount: number,
        price: number,
        timestamp: number,
        expiration: number,
        matcherFee?: Amount.AsObject,
        version: number,
        proofsList: Array<Uint8Array | string>,
        }


        export class AssetPair extends jspb.Message { 
    getAmountAssetId(): Uint8Array | string;
    getAmountAssetId_asU8(): Uint8Array;
    getAmountAssetId_asB64(): string;
    setAmountAssetId(value: Uint8Array | string): void;

    getPriceAssetId(): Uint8Array | string;
    getPriceAssetId_asU8(): Uint8Array;
    getPriceAssetId_asB64(): string;
    setPriceAssetId(value: Uint8Array | string): void;


            serializeBinary(): Uint8Array;
            toObject(includeInstance?: boolean): AssetPair.AsObject;
            static toObject(includeInstance: boolean, msg: AssetPair): AssetPair.AsObject;
            static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
            static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
            static serializeBinaryToWriter(message: AssetPair, writer: jspb.BinaryWriter): void;
            static deserializeBinary(bytes: Uint8Array): AssetPair;
            static deserializeBinaryFromReader(message: AssetPair, reader: jspb.BinaryReader): AssetPair;
        }

        export namespace AssetPair {
            export type AsObject = {
        amountAssetId: Uint8Array | string,
        priceAssetId: Uint8Array | string,
            }
        }


        export enum Side {
    BUY = 0,
    SELL = 1,
        }

    }


    export enum OrdersCase {
        ORDERS_NOT_SET = 0,
    
    BUY_SELL_ORDERS = 1,

    MAKER_TAKER_ORDERS = 2,

    }

}

export class SponsorFeeTransactionData extends jspb.Message { 

    hasMinFee(): boolean;
    clearMinFee(): void;
    getMinFee(): AssetAmount | undefined;
    setMinFee(value?: AssetAmount): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SponsorFeeTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: SponsorFeeTransactionData): SponsorFeeTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SponsorFeeTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SponsorFeeTransactionData;
    static deserializeBinaryFromReader(message: SponsorFeeTransactionData, reader: jspb.BinaryReader): SponsorFeeTransactionData;
}

export namespace SponsorFeeTransactionData {
    export type AsObject = {
        minFee?: AssetAmount.AsObject,
    }
}
