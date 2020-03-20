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

const selectFromSet = (aliasSet: string[] | knex.QueryBuilder) =>
  pg.select(columnsWithRowNumber).from({
    counted_aliases: pg({ t: 'txs_10' })
      .select({ alias: 't.alias' })
      .min({ address: 'addr.address' }) // first sender
      .min({ time_stamp: 'txs.time_stamp' }) // first tx timestamp
      .count({ duplicates: 't.sender_uid' }) // count senders grouped by alias
      .column({ rn: pg.raw('row_number() over (order by t.tx_uid)') }) // rn for pagination
      .leftJoin({ txs: 'txs' }, 'txs.uid', 't.tx_uid')
      .leftJoin({ addr: 'addresses' }, 'addr.uid', 't.sender_uid')
      .whereIn('t.alias', aliasSet)
      .groupBy('t.alias', 't.tx_uid'),
  });

export default {
  get: (alias: string) =>
    selectFromSet([alias])
      .select(columns)
      .clone()
      .toString(),
  mget: (aliases: string[]) =>
    selectFromSet(aliases)
      .select(columns)
      .clone()
      .toString(),
  search: ({ address, showBroken, after, limit }: AliasesSearchRequest) => {
    const q = pg('aliases_cte')
      .with(
        'aliases_cte',
        selectFromSet(
          pg('txs_10')
            .select('alias')
            .where(
              'sender_uid',
              pg('addresses')
                .select('uid')
                .from('addresses')
                .where('address', address)
                .limit(1)
            )
        )
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
