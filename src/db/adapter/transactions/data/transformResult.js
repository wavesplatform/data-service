const {
  compose,
  groupBy,
  prop,
  values,
  reduce,
  map,
  assoc,
  append,
  omit,
  merge,
  isNil,
  cond,
  always,
  isEmpty,
  identity,
  T,
} = require('ramda');

const getDataObject = txRow => ({
  key: txRow.data_key,
  type: txRow.data_type,
  value: txRow[`data_value_${txRow.data_type}`],
});

const removeDataEntryFromRow = omit([
  'tx_id',
  'data_key',
  'data_type',
  'data_value_integer',
  'data_value_boolean',
  'data_value_string',
  'data_value_binary',
  'position_in_tx',
]);

const appendRowToTx = (tx, row) =>
  compose(
    cond([
      [
        always(!isNil(row.data_type)),
        assoc('data', append(getDataObject(row), tx.data)),
      ],
      [T, identity],
    ]),
    merge(removeDataEntryFromRow(row))
  )(tx);

/**
 * Db returns list of object
 * { ...txAttributes, ...dataAttributes }
 * Need to restore transaction nested structure, grouping by
 * txAttributes and putting data objects nested into the tx
 */
const dataEntriesToTxs = cond([
  [isNil, always([])],
  [isEmpty, always([])],
  [
    T,
    compose(
      map(reduce(appendRowToTx, { data: [] })),
      values,
      groupBy(prop('id'))
    ),
  ],
]);

module.exports = dataEntriesToTxs;
