const createPgAdapter = require('./pg');

module.exports = ({ drivers }) => {
  const pgAdapter = createPgAdapter(drivers);
  return {
    get: id => pgAdapter.get(id),
    search: filters => pgAdapter.search(filters),
  };
};
