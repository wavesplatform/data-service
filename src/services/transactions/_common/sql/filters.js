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

const sender = (addr) => where('t.sender', addr);

const byTimeStamp = (comparator) => (ts) => (q) =>
  q.clone().where('t.time_stamp', comparator, ts.toISOString());

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

const byRecipient = (addressOrAlias) =>
  whereRaw(
    `recipient_address = coalesce((select sender from txs_10 where alias = '${addressOrAlias}' limit 1), '${addressOrAlias}')`
  );

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
