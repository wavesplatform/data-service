// test presets
const { get, mget, search } = require('../../_common/__test__/presets');

// test cases
const TX_ID = 'GN5SSawWUwodvAcHV2d96pe7HgFqvxoEAU9FCW9MUphE';
const TX_ID_2 = 'Co8JB3md1hsnFKYS2xonipBFyQcB7qskyosoJf6YhBi1';

// create service
const createService = require('..');
const { createPgDriver } = require('../../../../db');
const loadConfig = require('../../../../loadConfig');
const options = loadConfig();
const drivers = {
  pg: createPgDriver(options),
};
const service = createService({
  drivers,
  emitEvent: () => () => null,
});

// test body
describe('Transfer transaction service', () => {
  get(service, TX_ID);
  mget(service, [TX_ID, TX_ID_2]);
  search(service);
});
