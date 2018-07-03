const pg = require('knex')({ client: 'pg' });

const LIMIT = 1000;

const selectFromSet = aliasSet =>
  pg.select('alias', 'address', 'duplicates').from({
    counted_aliases: pg('txs_10')
      .select({ alias: 'alias' })
      .min({ address: 'sender' }) // first sender
      .min({ time_stamp: 'time_stamp' }) // first tx timestamp
      .count({ duplicates: 'sender' }) // count senders grouped by alias
      .whereIn('alias', aliasSet)
      .groupBy('alias'),
  });

module.exports = {
  one: alias =>
    selectFromSet([alias])
      .clone()
      .toString(),

  many: ({ address, showBroken }) => {
    const q = selectFromSet(
      pg('txs_10')
        .select('alias')
        .where('sender', address)
    )
      .clone()
      .orderBy('time_stamp', 'asc')
      .limit(LIMIT);

    // aliases are considered broken if 'duplicates' not equal to 1
    if (showBroken) {
      return q.toString();
    } else {
      return q
        .clone()
        .where('duplicates', 1)
        .toString();
    }
  },
};
