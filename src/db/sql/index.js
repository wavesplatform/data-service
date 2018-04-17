const { QueryFile } = require('pg-promise');
const path = require('path');

// Helper for linking to external query files:
function sql(file) {
  const fullPath = path.join(__dirname, file);
  return new QueryFile(fullPath, { minify: true });
}

module.exports = {
  assets: sql('./query/assets.sql'),
  volumes: sql('./query/volumes.sql'),
};
