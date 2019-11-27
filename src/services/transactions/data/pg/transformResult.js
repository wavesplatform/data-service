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
  either,
  sortBy,
  evolve,
  T,
} = require('ramda');

const getDataObject = txRow => ({
  key: txRow.data_key,
  type: txRow.data_type,
  value: txRow[`data_value_${txRow.data_type}`],
  positionInTx: txRow.position_in_tx, // for sorting later
});

const removeDataEntryFromRow = omit([
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
 * txAttributes and putting data objects nested into the tx,
 * preserving data entries order by sorting on `position_in_tx`
 */
const dataEntriesToTxs = cond([
  [either(isNil, isEmpty), always([])],
  [
    T,
    compose(
      // sort by position in tx, then remove it
      map(
        evolve({
          data: compose(
            map(omit(['positionInTx'])),
            sortBy(prop('positionInTx'))
          ),
        })
      ),
      map(reduce(appendRowToTx, { data: [] })),
      values,
      groupBy(prop('id'))
    ),
  ],
]);

module.exports = dataEntriesToTxs;
