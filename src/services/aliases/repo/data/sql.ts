import * as knex from 'knex';
import { compose } from 'ramda';
import { AliasesSearchRequest } from '../../repo';

const pg = knex({ client: 'pg' });

const columns = ['alias', 'address', 'duplicates'];
const columnsWithRowNumber = [...columns, 'rn'];

const getAliasRowNumber = (after: string) =>
  pg('aliases_cte')
    .select('rn')
    .where('alias', after);

const filterByAliases = (aliasSet: string[]) =>
  pg({ t: 'txs_10' })
    .select('t.tx_uid')
    .whereIn('t.alias', aliasSet);

const selectFiltered = (filtered: knex.QueryBuilder) =>
  pg.from({
    counted_aliases: pg({ t: 'txs_10' })
      .select({ alias: 't.alias' })
      .min({ address: 'addr.address' }) // first sender
      .count({ duplicates: 't.sender_uid' }) // count senders grouped by alias
      .column({ rn: pg.raw('row_number() over (order by t.tx_uid)') }) // rn for pagination
      .leftJoin({ addr: 'addresses' }, 'addr.uid', 't.sender_uid')
      .whereIn('t.tx_uid', filtered)
      .groupBy('t.alias', 't.tx_uid'),
  });

export default {
  get: (alias: string) =>
    selectFiltered(filterByAliases([alias]))
      .select(columns)
      .clone()
      .toString(),
  mget: (aliases: string[]) =>
    selectFiltered(filterByAliases(aliases))
      .select(columns)
      .clone()
      .toString(),
  search: ({ address, showBroken, after, limit }: AliasesSearchRequest) => {
    const q = pg('aliases_cte')
      .with(
        'aliases_cte',
        selectFiltered(
          pg('txs_10')
            .select('tx_uid')
            .where(
              'sender_uid',
              pg('addresses')
                .select('uid')
                .from('addresses')
                .where('address', address)
                .limit(1)
            )
        ).select(columnsWithRowNumber)
      )
      .select(columns)
      .orderBy('rn', 'asc')
      .limit(limit);

    return compose<knex.QueryBuilder, knex.QueryBuilder, string>(
      // aliases are considered broken if 'duplicates' not equal to 1
      q =>
        showBroken
          ? q.toString()
          : q
              .clone()
              .where('duplicates', 1)
              .toString(),
      q => (after ? q.where('rn', '>', getAliasRowNumber(after)) : q)
    )(q);
  },
};
