const knex = require('knex');
const pg = knex({ client: 'pg' });
const { where, whereIn } = require('../../../../../utils/db/knex');
const commonFilters = require('../../../_common/sql/filters');

const id = id => where('id', id);

const ids = ids => whereIn('id', ids);

const byTimeStamp = comparator => ts => q => {
  const sortDirection = comparator === '>' ? 'asc' : 'desc';
  return q
    .with('hp_cte', function() {
      this.select('height', 'position_in_block')
        .from('txs')
        .where('time_stamp', comparator, ts)
        .orderBy('height', sortDirection)
        .orderBy('position_in_block', sortDirection)
        .limit(1);
    })
    .where('height', comparator, pg('hp_cte').select('height'))
    .orWhere(function() {
      this.where('height', pg('hp_cte').select('height')).andWhere(
        'position_in_block',
        comparator,
        pg('hp_cte').select('position_in_block')
      );
    });
};

const after = ({ height, position_in_block, sort }) => q => {
  const comparator = sort === 'desc' ? '<' : '>';
  return q
    .where(function() {
      this.where('t.height', height).andWhere(
        't.position_in_block',
        comparator,
        position_in_block
      );
    })
    .orWhere('t.height', comparator, height);
};

module.exports = {
  filters: {
    ...commonFilters,
    id,
    ids,
    timeStart: byTimeStamp('>'),
    timeEnd: byTimeStamp('<'),
    sort: s => q =>
      q
        .clone()
        .orderBy('t.height', s)
        .orderBy('t.position_in_block', s),
    after,
  },
};
