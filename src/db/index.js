const connect = require('./connect');

const { formatPairs } = require('./utils');

const sql = require('./sql');

const createDb = options => {
  const db = connect(options);

  return {
    assets: assetIdArr => db.many(sql.assets, [assetIdArr]),
    volumes: pairs => db.many(sql.volumes, formatPairs(pairs)),
  };
};

module.exports = createDb;
