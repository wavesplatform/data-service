import * as knex from 'knex';
import * as commonFilters from '../../../_common/sql/filters'
import * as commonFiltersOrder from '../../../_common/sql/filtersOrder';
const pg = knex({ client: 'pg' });


const byTimeStamp = (comparator: string) => (ts: Date) => (q: knex.QueryBuilder) =>
    q
        .clone()
        .where(
            't.uid',
            comparator,
            pg('txs')
                .select('uid')
                .where('time_stamp', comparator, ts.toISOString())
                .orderByRaw(`time_stamp <-> '${ts.toISOString()}'::timestamptz`)
                .limit(1)
        );

export const filters = {
    ...commonFilters,

    timeStart: byTimeStamp('>='),
    timeEnd: byTimeStamp('<='),
};
export const filtersOrder = [...commonFiltersOrder, 'timeStart', 'timeEnd'];
