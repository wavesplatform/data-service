const createDataAdapter = require('./transactions/data');
const createAliasesAdapter = require('./aliases');

// db adapter factory
const createDbAdapter = options => ({
  transactions: {
    data: createDataAdapter(options),
  },

  aliases: createAliasesAdapter(options),
});

module.exports = createDbAdapter;
