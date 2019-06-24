const {
  always,
  complement,
  compose,
  cond,
  either,
  filter,
  groupBy,
  isEmpty,
  isNil,
  map,
  omit,
  prop,
  sortBy,
  T,
  uniqWith,
  values,
} = require('ramda');

import {
  InvokeScriptTxArgType,
  RawInvokeScriptTxArgValue,
  RawInvokeScriptTx,
  RawInvokeScriptTx as DbRawInvokeScriptTx,
  InvokeScriptTxArg,
  InvokeScriptTxPayment,
} from '../types';

const isNotNil = complement(isNil);

const getArgFieldByType = (
  type: InvokeScriptTxArgType
): keyof RawInvokeScriptTxArgValue => {
  switch (type) {
    case 'integer':
      return 'arg_value_integer';
    case 'boolean':
      return 'arg_value_boolean';
    case 'binary':
      return 'arg_value_binary';
    case 'string':
      return 'arg_value_string';
  }
};

const getArg = (txRaw: DbRawInvokeScriptTx): InvokeScriptTxArg => ({
  type: txRaw.arg_type,
  value: txRaw.arg_type ? txRaw[getArgFieldByType(txRaw.arg_type)] : null,
  // value: txRaw.arg_type ? txRaw[`arg_value_${txRaw.arg_type}`] : null,
  positionInArgs: txRaw.position_in_args, // for sorting later
});

const getPaymentItem = (txRaw: DbRawInvokeScriptTx): InvokeScriptTxPayment => ({
  amount: txRaw.amount,
  assetId: txRaw.asset_id,
  positionInPayment: txRaw.position_in_payment, // for sorting later
});

const removeUnnecessaryFromRaw = omit([
  'function_name',

  'arg_type',
  'arg_value_integer',
  'arg_value_boolean',
  'arg_value_string',
  'arg_value_binary',
  'position_in_args',

  'amount',
  'asset_id',
  'position_in_payment',
]);

const buildTxFromTxs = (
  txs: DbRawInvokeScriptTx[]
): RawInvokeScriptTx | null => {
  if (!Array.isArray(txs) || !txs.length) {
    return null;
  }

  const firstRaw = txs[0];
  const tx = removeUnnecessaryFromRaw(firstRaw);

  // fill tx.payment
  tx.payment = compose(
    map(omit(['positionInPayment'])),
    sortBy(prop('positionInPayment')),
    uniqWith(
      (a: InvokeScriptTxPayment, b: InvokeScriptTxPayment) =>
        a.positionInPayment === b.positionInPayment
    ),
    map(getPaymentItem),
    filter((tx: RawInvokeScriptTx) => isNotNil(prop('amount', tx)))
  )(txs);

  // fill tx.call
  if (!isNil(firstRaw.function_name)) {
    tx.call = {
      function: firstRaw.function_name,
      args: compose(
        map(omit(['positionInArgs'])),
        sortBy(prop('positionInArgs')),
        uniqWith(
          (a: InvokeScriptTxArg, b: InvokeScriptTxArg) =>
            a.positionInArgs === b.positionInArgs
        ),
        map(getArg),
        filter((tx: RawInvokeScriptTx) => isNotNil(prop('arg_type', tx)))
      )(txs),
    };
  }

  return tx;
};

/**
 * Db returns list of object
 * { ...txAttributes, ...argsAttributes, ...paymentAttributes }
 * Need to restore transaction nested structure, grouping by
 * txAttributes and putting args and payment objects nested into the tx,
 * preserving args and payment order by sorting on `position_in_args` and on `position_in_payment`
 */
export const transformResult = (
  t: DbRawInvokeScriptTx[]
): RawInvokeScriptTx[] =>
  cond([
    [either(isNil, isEmpty), always([])],
    [
      T,
      compose(
        map(buildTxFromTxs),
        values,
        groupBy(prop('id'))
      ),
    ],
  ])(t);
