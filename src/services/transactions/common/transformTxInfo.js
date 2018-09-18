const { renameKeys } = require('ramda-adjunct');
const { compose, ifElse, propEq, omit, identity } = require('ramda');

const hasEmptyProofs = propEq('proofs', []);
const processProofsAndSignature = ifElse(
  hasEmptyProofs,
  omit(['proofs']),
  omit(['signature'])
);

/** transformTxInfo:: RawTxInfo -> TxInfo */
const transformTxInfo = compose(
  processProofsAndSignature,
  // remove version if it is null
  ifElse(propEq('version', null), omit(['version']), identity),
  renameKeys({
    tx_type: 'type',
    tx_version: 'version',
    sender_public_key: 'senderPublicKey',
    time_stamp: 'timestamp',
  })
);

module.exports = transformTxInfo;
