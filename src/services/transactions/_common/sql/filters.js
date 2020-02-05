const { equals, ifElse } = require('ramda');
const {
  where,
  whereIn,
  whereRaw,
  limit,
} = require('../../../../utils/db/knex/index');
const { md5 } = require('../../../../utils/hash');

const id = id =>
  where('t.tx_uid', function() {
    this.select('uid')
      .from('txs')
      .where('id', id)
      .limit(1);
  });

const ids = ids =>
  whereIn('t.tx_uid', function() {
    this.select('uid')
      .from('txs')
      .whereIn('id', ids);
  });

const sender = addr =>
  where('t.sender_uid', function() {
    this.select('uid')
      .from('addresses')
      .where('address', addr);
  });

const byTimeStamp = comparator => ts =>
  where('t.tx_uid', comparator, function() {
    this.select('uid')
      .from('txs')
      .where('time_stamp', comparator, ts)
      .orderBy('uid', comparator === '>=' ? 'asc' : 'desc')
      .limit(1);
  });

const byAssetId = ifElse(
  equals('WAVES'),
  () => where('asset_uid', null),
  assetId =>
    where('asset_uid', function() {
      this.select('uid')
        .from('assets')
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

const sort = s => q => q.clone().orderBy('t.tx_uid', s);
const outerSort = s => q => q.clone().orderBy('txs.uid', s);

const after = ({ tx_uid, sort }) => {
  const comparator = sort === 'desc' ? '<' : '>';
  return where('t.tx_uid', comparator, tx_uid);
};

module.exports = {
  id,
  ids,
  sender,
  timeStart: byTimeStamp('>='),
  timeEnd: byTimeStamp('<='),
  sort,
  after,
  limit,
  outerSort,
  assetId: byAssetId,
  recipient: byRecipient,
  script: byScript,
};
