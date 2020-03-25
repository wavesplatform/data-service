const { equals, ifElse } = require('ramda');
const {
  where,
  whereIn,
  whereRaw,
  limit,
} = require('../../../../utils/db/knex/index');
const { md5 } = require('../../../../utils/hash');

const id = id => where('t.id', id);

const ids = ids => whereIn('t.id', ids);

const sender = addr =>
  where('t.sender_uid', function() {
    this.select('uid')
      .from('addresses')
      .where('address', addr)
      .limit(1);
  });

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
    .where('height', comparator, function() {
      this.select('height').from('hp_cte');
    })
    .orWhere(function() {
      this.where('height', function() {
        this.select('height').from('hp_cte');
      }).andWhere('position_in_block', comparator, function() {
        this.select('position_in_block').from('hp_cte');
      });
    });
};

const byAssetId = ifElse(
  equals('WAVES'),
  () => where('asset_uid', null),
  assetId =>
    where('asset_uid', function() {
      this.select('uid')
        .from('assets_data')
        .where('asset_id', assetId)
        .limit(1);
    })
);

const byRecipient = r =>
  where('recipient_address_uid', function() {
    this.select('uid')
      .from('addresses')
      .where('address', r)
      .limit(1);
  });

const byScript = s => whereRaw('md5(script) = ?', md5(s));

const sort = s => q =>
  q
    .clone()
    .orderBy('t.height', s)
    .orderBy('t.position_in_block', s);

const after = ({ height, position_in_block, sort }) => q => {
  const comparator = sort === 'desc' ? '<' : '>';
  return q
    .clone()
    .where('height', comparator, height)
    .orWhere(function() {
      this.where('height', height).andWhere(
        'position_in_block',
        comparator,
        position_in_block
      );
    });
};

module.exports = {
  id,
  ids,
  sender,
  timeStart: byTimeStamp('>'),
  timeEnd: byTimeStamp('<'),
  sort,
  after,
  limit,
  assetId: byAssetId,
  recipient: byRecipient,
  script: byScript,
};
