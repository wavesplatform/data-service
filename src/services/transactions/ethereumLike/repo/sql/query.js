const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_18' });

const selectFromFiltered = (filtered) =>
  filtered.column({
    uid: 't.uid',
    height: 't.height',
    tx_type: 't.tx_type',
    id: 't.id',
    time_stamp: 't.time_stamp',
    signature: 't.signature',
    proofs: 't.proofs',
    tx_version: 't.tx_version',
    fee: 't.fee',
    status: 't.status',
    sender: 't.sender',
    sender_public_key: 't.sender_public_key',

    bytes: 't.payload', // todo rename in DB
    function_name: 't.function_name',
  });

module.exports = { select, selectFromFiltered };
