const { compose, isNil, reject } = require('ramda');
const { renameKeys } = require('ramda-adjunct');

/** transformTx:: RawTxInfo -> TxInfo */
const transformTx = compose(
  renameKeys({
    tx_type: 'type',
    tx_version: 'version',
    sender_public_key: 'senderPublicKey',
    time_stamp: 'timestamp',
  }),
  reject(isNil)
);

module.exports = { transformTx };
