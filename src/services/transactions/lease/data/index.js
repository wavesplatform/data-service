const createPgAdapter = require('./pg');

module.exports = ({ drivers }) => {
  const pgAdapter = createPgAdapter(drivers);
  return {
    get: tx4Id => pgAdapter.get(tx4Id),
    search: filters => pgAdapter.search(filters),
  };
};
