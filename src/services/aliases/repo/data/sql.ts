import * as knex from 'knex';
import { defaultTo } from 'ramda';
import { AliasesSearchRequest } from '../../repo';

const pg = knex({ client: 'pg' });

const LIMIT = 1000;

const selectFromSet = (aliasSet: string[] | knex.QueryBuilder) =>
  pg.select('alias', 'address', 'duplicates').from({
    counted_aliases: pg({ t: 'txs_10' })
      .select({ alias: 't.alias' })
      .min({ address: 'addr.address' }) // first sender
      .min({ time_stamp: 'txs.time_stamp' }) // first tx timestamp
      .count({ duplicates: 't.sender_uid' }) // count senders grouped by alias
      .leftJoin({ txs: 'txs' }, 'txs.uid', 't.tx_uid')
      .leftJoin({ addr: 'addresses' }, 'addr.uid', 't.sender_uid')
      .whereIn('t.alias', aliasSet)
      .groupBy('t.alias'),
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
        .where(
          'sender_uid',
          pg('addresses')
            .select('uid')
            .from('addresses')
            .where('address', address)
            .limit(1)
        )
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
