import { BigNumber } from '@waves/data-entities';
import { RawTx, Tx, CommonFilters } from '../../_common/types';
import { RequestWithCursor } from '../../../_common/pagination';
import { WithSortOrder, WithLimit } from '../../../_common';
import { Repo } from '../../../../types';

export type InvokeScriptTxArgType =
  | 'integer'
  | 'boolean'
  | 'binary'
  | 'string'
  | 'list';

export type RawInvokeScriptTxArgValue = {
  arg_value_integer: BigNumber | null;
  arg_value_boolean: boolean | null;
  arg_value_binary: Buffer | null;
  arg_value_string: string | null;
  arg_value_list: Array<bigint | boolean | Buffer | string> | null;
};

export type RawInvokeScriptTxArg = RawInvokeScriptTxArgValue & {
  arg_type: InvokeScriptTxArgType;
  position_in_args: number;
};

export type RawInvokeScriptTxPayment = {
  amount: BigNumber;
  asset_id: string;
  position_in_payment: number;
};

export type RawInvokeScriptTx = RawTx &
  RawInvokeScriptTxArg &
  RawInvokeScriptTxPayment & {
    dapp: string;
    function_name: string | null;
  };

export type InvokeScriptTxArg = {
  type: InvokeScriptTxArgType;
  value:
    | RawInvokeScriptTxArgValue['arg_value_binary']
    | RawInvokeScriptTxArgValue['arg_value_boolean']
    | RawInvokeScriptTxArgValue['arg_value_integer']
    | RawInvokeScriptTxArgValue['arg_value_string']
    | RawInvokeScriptTxArgValue['arg_value_list'];
  positionInArgs: number;
};

export type InvokeScriptTxPayment = {
  amount: BigNumber;
  assetId: string;
  positionInPayment: number;
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
  InvokeScriptTx
>;
