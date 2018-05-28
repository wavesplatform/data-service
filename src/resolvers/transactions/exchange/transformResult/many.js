const { transformTx } = require('./common');

const { Transaction, List, fromMaybe } = require('../../../../types');

const { map, compose } = require('ramda');

/** transformResults :: (Maybe RawTxInfo)[] -> List Tx */
const transformResults = compose(
  List,
  map(fromMaybe(Transaction)),
  map(map(transformTx))
);

module.exports = transformResults;
