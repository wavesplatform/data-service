const pg = require('knex')({ client: 'pg' });
const { complement, isNil } = require('ramda');

const LIMIT = 1000;

const baseSelect = pg('txs_10')
  .select({ alias: 'alias' })
  .min({ address: 'sender' }) // first sender
  .min({ time_stamp: 'time_stamp' }) // first tx timestamp
  .count({ duplicates: 'sender' }) // count senders grouped by alias
  .groupBy('alias');

const selectAfterFilters = (q) =>
  pg.select('alias', 'address', 'duplicates').from({ a: q });

const withAliases = (qb, aliasSet) => qb.whereIn('alias', aliasSet);

const selectFromSet = (aliasSet) =>
  selectAfterFilters(withAliases(baseSelect.clone(), aliasSet));

// address has 31 <= length <= 45
// alias has 4 <= length <= 15
const minAddressLength = 31;
const isAddress = (addressOrAlias) => addressOrAlias.length >= minAddressLength;

module.exports = {
  get: (alias) => selectFromSet([alias]).clone().toString(),

  mget: (aliases) => selectFromSet(aliases).clone().toString(),

  search: ({ address, addresses, queries, showBroken }) => {
    const queryWithSenderFilter = baseSelect.clone();
    let aliases = [];

    switch (true) {
      case !isNil(address):
        queryWithSenderFilter.where('sender', address);
        break;

      case !isNil(addresses):
        queryWithSenderFilter.whereIn('sender', addresses);
        break;

      case !isNil(queries):
        queryWithSenderFilter.whereIn('sender', queries.filter(isAddress));
        aliases = queries.filter(complement(isAddress));
        break;
    }

    const searchQuery = selectAfterFilters(
      pg({
        a: pg({ a1: queryWithSenderFilter }).unionAll(
          pg({ a2: withAliases(baseSelect.clone(), aliases) })
        ),
      })
        .distinct()
        .select('alias', 'address', 'duplicates', 'time_stamp')
    )
      .orderBy('time_stamp', 'asc')
      .limit(LIMIT);

    // aliases are considered broken if 'duplicates' not equal to 1
    if (showBroken) {
      return searchQuery.toString();
    } else {
      return searchQuery.clone().where('duplicates', 1).toString();
    }
  },
};
