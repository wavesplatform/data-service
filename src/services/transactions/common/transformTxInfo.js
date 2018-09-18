const { renameKeys } = require('ramda-adjunct');
const { compose, ifElse, propEq, omit, defaultTo, evolve } = require('ramda');

const hasEmptyProofs = propEq('proofs', []);
const processProofsAndSignature = ifElse(
  hasEmptyProofs,
  omit(['proofs']),
  omit(['signature'])
);

/** transformTxInfo:: RawTxInfo -> TxInfo */
const transformTxInfo = compose(
  processProofsAndSignature,
  evolve({ version: defaultTo(1) }),
  renameKeys({
    tx_type: 'type',
    tx_version: 'version',
    sender_public_key: 'senderPublicKey',
    time_stamp: 'timestamp',
  })
);

module.exports = transformTxInfo;
