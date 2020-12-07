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

const senders = (addrs) => whereIn('t.sender', addrs);

const byTimeStamp = (comparator) => (ts) => (q) =>
  q.clone().where('t.time_stamp', comparator, ts.toISOString());

const byAssetId = (assetId) => where('asset_id', assetId);

const byRecipient = (addressOrAlias) =>
  whereRaw(
    `recipient_address = coalesce((select sender from txs_10 where alias = '${addressOrAlias}' limit 1), '${addressOrAlias}')`
  );

const byScript = (s) => whereRaw('md5(script) = ?', md5(s));

const sort = (s) => (q) => q.clone().orderBy('t.uid', s);

const after = ({ uid, sort }) => (q) => {
  const comparator = sort === 'desc' ? '<' : '>';
  return q.clone().whereRaw(`t.uid ${comparator} ${uid.toString()}`);
};

module.exports = {
  id,
  ids,
  sender,
  senders,
  timeStart: byTimeStamp('>='),
  timeEnd: byTimeStamp('<='),
  sort,
  after,
  limit,
  assetId: byAssetId,
  recipient: byRecipient,
  script: byScript,
};
