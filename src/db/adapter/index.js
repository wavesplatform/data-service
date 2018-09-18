const createExchangeAdapter = require('./transactions/exchange');
const createDataAdapter = require('./transactions/data');
const createAliasesAdapter = require('./aliases');

// db adapter factory
const createDbAdapter = options => ({
  transactions: {
    exchange: createExchangeAdapter(options),
    data: createDataAdapter(options),
  },

  aliases: createAliasesAdapter(options),
});

module.exports = createDbAdapter;
