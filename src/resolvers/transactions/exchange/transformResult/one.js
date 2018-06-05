const { transformTx } = require('./common');

const { Transaction } = require('../../../../types');

const { compose, map } = require('ramda');

const txOrNull = maybeTx =>
  maybeTx.matchWith({
    Just: ({ value }) => Transaction(value),
    Nothing: () => null,
  });

/** transformResults :: (Maybe RawTxInfo)[] -> Tx | null */
const transformResults = compose(txOrNull, map(transformTx));

module.exports = transformResults;
