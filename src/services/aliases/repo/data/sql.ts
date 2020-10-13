import * as knex from 'knex';
import { complement, compose, isNil } from 'ramda';
import { AliasesSearchRequest } from '../../repo';

const pg = knex({ client: 'pg' });

const columns = ['alias', 'address', 'duplicates'];
const columnsWithRowNumber = [...columns, 'rn'];

// address has 31 <= length <= 45
// alias has 4 <= length <= 15
const minAddressLength = 31;
const isAddress = (addressOrAlias: string) =>
  addressOrAlias.length >= minAddressLength;

const getAliasRowNumber = (after: string) =>
  pg('aliases_cte').select('rn').where('alias', after);

const baseQuery = (qb: knex.QueryBuilder) =>
  qb.from({ t: 'txs_10' }).select('t.tx_uid');

const selectAfterFilters = (q: knex.QueryBuilder) =>
  pg.select(columns).from({ a: q });

const filterByAliases = (qb: knex.QueryBuilder, aliasSet: string[]) =>
  qb.whereIn('t.alias', aliasSet);

const selectFiltered = (filtered: knex.QueryBuilder) =>
  pg.from({
    counted_aliases: pg({ t: 'txs_10' })
      .select({ alias: 't.alias' })
      .min({ address: 't.sender' }) // first sender
      .count({ duplicates: 't.sender' }) // count senders grouped by alias
      .column({ rn: pg.raw('row_number() over (order by t.tx_uid)') }) // rn for pagination
      .whereIn('t.tx_uid', filtered)
      .groupBy('t.alias', 't.tx_uid'),
  });

export default {
  get: (alias: string) =>
    selectAfterFilters(
      selectFiltered(filterByAliases(baseQuery(pg()), [alias]))
    )
      .clone()
      .toString(),
  mget: (aliases: string[]) =>
    selectAfterFilters(
      selectFiltered(filterByAliases(baseQuery(pg()), aliases))
    )
      .clone()
      .toString(),
  search: ({
    address,
    addresses,
    queries,
    showBroken,
    limit,
    after,
  }: AliasesSearchRequest) => {
    const query = baseQuery(pg());

    let aliases: string[] = [];

    switch (true) {
      case !isNil(address):
        query.where('sender', address as string);
        break;

      case !isNil(addresses):
        query.whereIn('sender', addresses as string[]);
        break;

      case !isNil(queries):
        query.whereIn('sender', (queries as string[]).filter(isAddress));
        aliases = (queries as string[]).filter(complement(isAddress));
        break;
    }

    const q = selectAfterFilters(
      pg('aliases_cte').with(
        'aliases_cte',
        selectFiltered(
          query.unionAll((qb: knex.QueryBuilder) =>
            filterByAliases(baseQuery(qb), aliases)
          )
        )
          .distinct()
          .select(columnsWithRowNumber)
      )
    )
      .orderBy('rn', 'asc')
      .limit(limit);

    return compose<knex.QueryBuilder, knex.QueryBuilder, string>(
      // aliases are considered broken if 'duplicates' not equal to 1
      (q) =>
        showBroken ? q.toString() : q.clone().where('duplicates', 1).toString(),
      (q) => (after ? q.where('rn', '>', getAliasRowNumber(after)) : q)
    )(q);
  },
};
