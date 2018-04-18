// const { formatPairs, batchQuery } = require('./utils');

const { task } = require('folktale/concurrency/task');

const sql = require('./sql');

const taskify = (promiseFactory, errorTransform) =>
  task(resolver =>
    promiseFactory()
      .then(resolver.resolve)
      .catch(resolver.reject)
  ).mapRejected(errorTransform);

const createDbAdapter = db => {
  return {
    assets: assetIdArr =>
      taskify(
        () => db.many(sql.assets, [assetIdArr]),
        () => new Error('Db error')
      ),
    // compose(
    // batchQuery((reqId, { id }) => reqId === id, assetIdArr),
    // a => { console.log(a); return a},
    // bind(db.many)
    // )(sql.assets, [assetIdArr]),
    // volumes: pairs => db.many(sql.volumes, formatPairs(pairs)),
  };
};

module.exports = createDbAdapter;
