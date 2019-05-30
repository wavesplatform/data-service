const {
  always,
  append,
  assoc,
  assocPath,
  compose,
  cond,
  either,
  evolve,
  groupBy,
  identity,
  isEmpty,
  isNil,
  map,
  merge,
  omit,
  pathOr,
  prop,
  reduce,
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

const appendArgsToTx = (tx, row) =>
  compose(
    cond([
      [
        always(!isNil(row.amount)),
        assoc(
          'payment',
          uniqWith(
            (a, b) => a.positionInPayment === b.positionInPayment,
            append(getPaymentItem(row), tx.payment)
          )
        ),
      ],
      [T, identity],
    ]),
    cond([
      [
        always(!isNil(row.arg_type)),
        assocPath(
          ['call', 'args'],
          uniqWith(
            (a, b) => a.positionInArgs === b.positionInArgs,
            append(getArg(row), pathOr([], ['call', 'args'], tx))
          )
        ),
      ],
      [T, identity],
    ]),
    cond([
      [
        always(!isNil(row.function_name)),
        assoc('call', { function: row.function_name, args: [] }),
      ],
      [T, identity],
    ]),
    merge(removeUnnecessaryFromRow(row))
  )(tx);

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
      // sort by position in tx, then remove it
      map(
        evolve({
          call: evolve({
            args: compose(
              map(omit(['positionInArgs'])),
              sortBy(prop('positionInArgs'))
            ),
          }),
          payment: compose(
            compose(
              map(omit(['positionInPayment'])),
              sortBy(prop('positionInPayment'))
            )
          ),
        })
      ),
      map(reduce(appendArgsToTx, { payment: [] })),
      values,
      groupBy(prop('id'))
    ),
  ],
]);

module.exports = toTxs;
