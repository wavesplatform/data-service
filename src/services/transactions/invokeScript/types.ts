import { RawTx, Tx } from '../_common/types';

export type InvokeScriptTxArgType = 'integer' | 'boolean' | 'binary' | 'string';

export type RawInvokeScriptTxArgValue = {
  arg_value_integer: bigint | null;
  arg_value_boolean: boolean | null;
  arg_value_binary: Buffer | null;
  arg_value_string: string | null;
};

export type RawInvokeScriptTxArg = RawInvokeScriptTxArgValue & {
  arg_type: InvokeScriptTxArgType | null;
  position_in_args: number | null;
};

export type RawInvokeScriptTxPayment = {
  amount: bigint | null;
  asset_id: string | null;
  position_in_payment: number | null;
};

export type RawInvokeScriptTx = RawTx &
  RawInvokeScriptTxArg &
  RawInvokeScriptTxPayment & {
    dapp: string;
    function_name: string | null;
  };

export type InvokeScriptTxArg = {
  type: RawInvokeScriptTx['arg_type'];
  value:
    | RawInvokeScriptTx['arg_value_binary']
    | RawInvokeScriptTx['arg_value_boolean']
    | RawInvokeScriptTx['arg_value_integer']
    | RawInvokeScriptTx['arg_value_string'];
  positionInArgs: RawInvokeScriptTx['position_in_args'];
};

export type InvokeScriptTxPayment = {
  amount: RawInvokeScriptTx['amount'];
  assetId: RawInvokeScriptTx['asset_id'];
  positionInPayment: RawInvokeScriptTx['position_in_payment'];
};

export type InvokeScriptTx = Tx & {
  dApp: string;
  call: {
    function: string;
    args: InvokeScriptTxArg[];
  };
  payment: InvokeScriptTxPayment[];
};
