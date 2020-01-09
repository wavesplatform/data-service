import * as knex from 'knex';
import { defaultTo } from 'ramda';
import { AliasesSearchRequest } from '../../repo';

const pg = knex({ client: 'pg' });

const LIMIT = 1000;

const selectFromSet = (aliasSet: string[] | knex.QueryBuilder) =>
  pg.select('alias', 'address', 'duplicates').from({
    counted_aliases: pg('txs_10')
      .select({ alias: 'alias' })
      .min({ address: 'sender' }) // first sender
      .min({ time_stamp: 'time_stamp' }) // first tx timestamp
      .count({ duplicates: 'sender' }) // count senders grouped by alias
      .whereIn('alias', aliasSet)
      .groupBy('alias'),
  });

export default {
  get: (alias: string) =>
    selectFromSet([alias])
      .clone()
      .toString(),
  mget: (aliases: string[]) =>
    selectFromSet(aliases)
      .clone()
      .toString(),
  search: ({ address, showBroken, limit }: AliasesSearchRequest) => {
    const q = selectFromSet(
      pg('txs_10')
        .select('alias')
        .where('sender', address)
    )
      .clone()
      .orderBy('time_stamp', 'asc')
      .limit(defaultTo(LIMIT, limit));

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
