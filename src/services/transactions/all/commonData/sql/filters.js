const { where, whereIn } = require('../../../../../utils/db/knex');
const commonFilters = require('../../../_common/sql/filters');

const id = id =>
  where('t.uid', function() {
    this.select('uid')
      .from('txs')
      .where('id', id)
      .limit(1);
  });

const ids = ids =>
  whereIn('t.uid', function() {
    this.select('uid')
      .from('txs')
      .whereIn('id', ids);
  });

const byTimeStamp = comparator => ts =>
  where('t.uid', comparator, function() {
    this.select('uid')
      .from('txs')
      .where('time_stamp', comparator, ts)
      .orderBy('time_stamp', comparator === '>=' ? 'asc' : 'desc')
      .limit(1);
  });

module.exports = {
  filters: {
    ...commonFilters,
    id,
    ids,
    timeStart: byTimeStamp('>='),
    timeEnd: byTimeStamp('<='),
    sort: s => q => q.clone().orderBy('t.uid', s),
  },
};
