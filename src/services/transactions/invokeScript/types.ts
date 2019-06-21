import { DbRawTx, RawTx, Tx } from '../_common/types';

export type InvokeScriptTxArgType = 'integer' | 'boolean' | 'binary' | 'string';

export type DbRawInvokeScriptTxArgValue = {
  arg_value_integer: bigint | null;
  arg_value_boolean: boolean | null;
  arg_value_binary: Buffer | null;
  arg_value_string: string | null;
};

export type DbRawInvokeScriptTxArg = DbRawInvokeScriptTxArgValue & {
  arg_type: InvokeScriptTxArgType | null;
  position_in_args: number | null;
};

export type DbRawInvokeScriptTxPayment = {
  amount: bigint | null;
  asset_id: string | null;
  position_in_payment: number | null;
};

export type DbRawInvokeScriptTx = DbRawTx &
  DbRawInvokeScriptTxArg &
  DbRawInvokeScriptTxPayment & {
    dapp: string;
    function_name: string | null;
  };

export type InvokeScriptTxArg = {
  type: DbRawInvokeScriptTx['arg_type'];
  value:
    | DbRawInvokeScriptTx['arg_value_binary']
    | DbRawInvokeScriptTx['arg_value_boolean']
    | DbRawInvokeScriptTx['arg_value_integer']
    | DbRawInvokeScriptTx['arg_value_string'];
  positionInArgs: DbRawInvokeScriptTx['position_in_args'];
};

export type InvokeScriptTxPayment = {
  amount: DbRawInvokeScriptTx['amount'];
  assetId: DbRawInvokeScriptTx['asset_id'];
  positionInPayment: DbRawInvokeScriptTx['position_in_payment'];
};

export type RawInvokeScriptTx = RawTx & {
  dApp: string;
  call: {
    function: string;
    args: InvokeScriptTxArg[];
  };
  payment: InvokeScriptTxPayment[];
};

export type InvokeScriptTx = Tx & {
  dApp: string;
  call: {
    function: string;
    args: InvokeScriptTxArg[];
  };
  payment: InvokeScriptTxPayment[];
};
