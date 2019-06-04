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

const getArg = txRow => ({
  type: txRow.arg_type,
  value: txRow[`arg_value_${txRow.arg_type}`],
  positionInArgs: txRow.position_in_args, // for sorting later
});

const getPaymentItem = txRow => ({
  amount: txRow.amount,
  assetId: txRow.asset_id,
  positionInPayment: txRow.position_in_payment, // for sorting later
});

const removeUnnecessaryFromRow = omit([
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

const buildTxFromTxs = txs => {
  if (!Array.isArray(txs) || !txs.length) {
    return null;
  }

  const firstRow = txs[0];
  const tx = removeUnnecessaryFromRow(firstRow);

  // fill tx.payment
  tx.payment = compose(
    map(omit(['positionInPayment'])),
    sortBy(prop('positionInPayment')),
    uniqWith((a, b) => a.positionInPayment === b.positionInPayment),
    map(getPaymentItem),
    filter(always(complement(isNil(prop('amount')))))
  )(txs);

  // fill tx.call
  if (!isNil(firstRow.function_name)) {
    tx.call = {
      function: firstRow.function_name,
      args: compose(
        map(omit(['positionInArgs'])),
        sortBy(prop('positionInArgs')),
        uniqWith((a, b) => a.positionInArgs === b.positionInArgs),
        map(getArg),
        filter(always(complement(isNil(prop('arg_type')))))
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
const toTxs = cond([
  [either(isNil, isEmpty), always([])],
  [
    T,
    compose(
      map(buildTxFromTxs),
      values,
      groupBy(prop('id'))
    ),
  ],
]);

module.exports = toTxs;
