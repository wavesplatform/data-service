import * as knex from 'knex';
import { complement, compose } from 'ramda';
import {
  AliasesSearchRequest,
  WithAddress,
  WithAddresses,
  WithQueries,
} from '../../repo';

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
  qb.from({ t: 'txs_10' }).select('t.uid');

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
      .column({ rn: pg.raw('row_number() over (order by t.uid)') }) // rn for pagination
      .whereIn('t.uid', filtered)
      .groupBy('t.alias', 't.uid'),
  });

const withAddress = (
  req: AliasesSearchRequest
): req is AliasesSearchRequest & WithAddress => typeof req.address === 'string';

const withAddresses = (
  req: AliasesSearchRequest
): req is AliasesSearchRequest & WithAddresses => Array.isArray(req.addresses);

const withQueries = (
  req: AliasesSearchRequest
): req is AliasesSearchRequest & WithQueries => Array.isArray(req.queries);

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
  search: (req: AliasesSearchRequest) => {
    const query = baseQuery(pg());

    let aliases: string[] = [];

    if (withAddress(req)) {
      query.where('sender', req.address);
    } else if (withAddresses(req)) {
      query.whereIn('sender', req.addresses);
    } else if (withQueries(req)) {
      query.whereIn('sender', req.queries.filter(isAddress));
      aliases = req.queries.filter(complement(isAddress));
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
      .limit(req.limit);

    return compose<knex.QueryBuilder, knex.QueryBuilder, string>(
      // aliases are considered broken if 'duplicates' not equal to 1
      (q) =>
        req.showBroken
          ? q.toString()
          : q.clone().where('duplicates', 1).toString(),
      (q) => (req.after ? q.where('rn', '>', getAliasRowNumber(req.after)) : q)
    )(q);
  },
};
