const { where, whereNull, whereNotNull } = require('../../../../../utils/db/knex');

const { createByTimeStamp, createByBlockTimeStamp } = require('../../../_common/sql');
const {
  id,
  ids,
  sender,
  senders,
  sort,
  after,
  limit,
} = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

const byTimeStamp = createByTimeStamp('txs_18');

const byBlockTimeStamp = createByBlockTimeStamp('txs_18');

module.exports = {
  filters: {
    id,
    ids,
    sender,
    senders,
    sort,
    after,
    limit,

    type: (transferOrInvocation) =>
      transferOrInvocation === 'transfer'
        ? whereNull('function_name')
        : whereNotNull('function_name'),

    function: (functionName) => where('function_name', functionName),

    timeStart: byTimeStamp('>='),
    timeEnd: byTimeStamp('<='),
    blockTimeStart: byBlockTimeStamp('>='),
    blockTimeEnd: byBlockTimeStamp('<='),
  },
  filtersOrder: [...commonFiltersOrder, 'timeStart', 'timeEnd', 'type', 'function'],
};
