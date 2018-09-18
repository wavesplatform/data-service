const createAliasesAdapter = require('./aliases');

// db adapter factory
const createDbAdapter = options => ({
  aliases: createAliasesAdapter(options),
});

module.exports = createDbAdapter;
