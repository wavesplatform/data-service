const { equals, ifElse } = require('ramda');
const {
  where,
  whereIn,
  whereRaw,
  limit,
} = require('../../../../utils/db/knex/index');
const { md5 } = require('../../../../utils/hash');

const id = (id) => where('t.id', id);

const ids = (ids) => whereIn('t.id', ids);

const sender = (addr) =>
  where('t.sender_uid', function () {
    this.select('uid').from('addresses').where('address', addr).limit(1);
  });

const byTimeStamp = (comparator) => (ts) => (q) => {
  const sortDirection = comparator === '>' ? 'asc' : 'desc';
  const cteName = `cte_${sortDirection}`;
  return q
    .clone()
    .with(cteName, function () {
      this.select('uid')
        .from('txs')
        .where('time_stamp', comparator, ts)
        .orderBy('uid', sortDirection)
        .limit(1);
    })
    .where('t.tx_uid', comparator, function () {
      this.select('uid').from(cteName);
    });
};

const byAssetId = ifElse(
  equals('WAVES'),
  () => where('asset_uid', null),
  (assetId) =>
    where('asset_uid', function () {
      this.select('uid')
        .from('assets_data')
        .where('asset_id', assetId)
        .limit(1);
    })
);

const byRecipient = (r) =>
  where('recipient_address_uid', function () {
    this.select('uid').from('addresses').where('address', r).limit(1);
  });

const byScript = (s) => whereRaw('md5(script) = ?', md5(s));

const sort = (s) => (q) => q.clone().orderBy('t.tx_uid', s);

const after = ({ tx_uid, sort }) => (q) => {
  const comparator = sort === 'desc' ? '<' : '>';
  return q.clone().whereRaw(`t.tx_uid ${comparator} ${tx_uid.toString()}`);
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
