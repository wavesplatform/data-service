const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_1' }).select('*');

const selectFromFiltered = filtered =>
  pg({ t: filtered })
    .select({
      tx_uid: 't.tx_uid',
      height: 't.height',
      tx_type: 'txs.tx_type',
      id: 'txs.id',
      time_stamp: 'txs.time_stamp',
      signature: 'txs.signature',
      proofs: 'txs.proofs',
      tx_version: 'txs.tx_version',
      fee: 'txs.fee',
      recipient: pg.raw(
        'coalesce(recipient_alias.alias, recipient_addr.address)'
      ),
      amount: pg.raw('t.amount * 10^(-8)'),
    })
    .leftJoin('txs', 'txs.uid', 't.tx_uid')
    .leftJoin({ addr: 'addresses' }, 'addr.uid', 't.sender_uid')
    .leftJoin(
      { recipient_addr: 'addresses' },
      'recipient_addr.uid',
      't.recipient_address_uid'
    )
    .leftJoin(
      { recipient_alias: 'txs_10' },
      'recipient_alias.tx_uid',
      't.recipient_alias_uid'
    );

module.exports = { select, selectFromFiltered };
