import { createByTimeStamp, createByBlockTimeStamp } from '../../../_common/sql';
import * as commonFilters from '../../../_common/sql/filters'
import * as commonFiltersOrder from '../../../_common/sql/filtersOrder';

const byTimeStamp = createByTimeStamp('txs');

const byBlockTimesStamp = createByBlockTimeStamp('txs');

export const filters = {
    ...commonFilters,

    timeStart: byTimeStamp('>='),
    timeEnd: byTimeStamp('<='),
    blockTimeStart: byBlockTimesStamp('>='),
    blockTimeEnd: byBlockTimesStamp('<='),
};
export const filtersOrder = [...commonFiltersOrder, 'timeStart', 'timeEnd'];
