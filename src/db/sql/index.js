const { QueryFile } = require('pg-promise');
const path = require('path');

// Helper for linking to external query files:
function sql(file) {
  const fullPath = path.join(__dirname, file);
  return new QueryFile(fullPath, { minify: true });
}

// @todo refactor — remove different ways to construct sql
module.exports = {
  raw: {
    assets: sql('./raw/assets.sql'),
    pair: sql('./raw/pair.sql'),
  },
  build: require('./build'),
};
