const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_2' }).select('*');

const selectFromFiltered = filtered =>
  pg
    .select({
      // common
      tx_uid: 't.tx_uid',
      height: 't.height',
      tx_type: 'txs.tx_type',
      id: 'txs.id',
      time_stamp: 'txs.time_stamp',
      signature: 'txs.signature',
      proofs: 'txs.proofs',
      tx_version: 'txs.tx_version',
      fee: pg.raw('txs.fee * 10^(-8)'),
      sender: 'addr.address',
      sender_public_key: 'addr.public_key',

      // type-specific
      amount: pg.raw('t.amount * 10^(-8)'),
      recipient: pg.raw(
        'coalesce(recipient_alias.alias, recipient_addr.address)'
      ),
    })
    .from({
      t: pg
        .select('*')
        .select({
          rn: pg.raw(
            'row_number() over (partition by tx_uid order by tx_uid asc)'
          ),
        })
        .from({ t: filtered }),
    })
    .where('rn', '=', 1)
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
