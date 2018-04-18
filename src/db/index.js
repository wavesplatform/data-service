const connect = require('./connect');

const { formatPairs, batchQuery } = require('./utils');

const sql = require('./sql');

const { compose, bind } = require('ramda');

const createDb = options => {
  const db = connect(options);

  return {
    assets: assetIdArr => {
      return db.many(sql.assets, [assetIdArr]);
    },
    // compose(
    // batchQuery((reqId, { id }) => reqId === id, assetIdArr),
    // a => { console.log(a); return a},
    // bind(db.many)
    // )(sql.assets, [assetIdArr]),
    volumes: pairs => db.many(sql.volumes, formatPairs(pairs)),
  };
};

module.exports = createDb;
