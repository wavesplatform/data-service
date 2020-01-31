import { BigNumber } from '@waves/data-entities';
import { RawTx, Tx, CommonFilters } from '../../_common/types';
import { RequestWithCursor } from '../../../_common/pagination';
import { WithSortOrder, WithLimit } from '../../../_common';
import { Repo, TransactionInfo } from '../../../../types';

export type InvokeScriptTxArgType = 'integer' | 'boolean' | 'binary' | 'string';

export type RawInvokeScriptTxArgValue = {
  arg_value_integer: BigNumber | null;
  arg_value_boolean: boolean | null;
  arg_value_binary: Buffer | null;
  arg_value_string: string | null;
};

export type RawInvokeScriptTxArg = RawInvokeScriptTxArgValue & {
  arg_type: InvokeScriptTxArgType | null;
  position_in_args: number | null;
};

export type RawInvokeScriptTxPayment = {
  amount: BigNumber | null;
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

export type InvokeScriptTxsGetRequest = string;
export type InvokeScriptTxsMgetRequest = string[];

export type InvokeScriptTxsSearchRequest<
  CursorType = string
> = RequestWithCursor<
  CommonFilters &
    WithSortOrder &
    WithLimit &
    Partial<{
      dapp: string;
      function: string;
    }>,
  CursorType
>;

export type InvokeScriptTxsRepo = Repo<
  InvokeScriptTxsGetRequest,
  InvokeScriptTxsMgetRequest,
  InvokeScriptTxsSearchRequest,
  TransactionInfo
>;
