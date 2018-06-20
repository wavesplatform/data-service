const createResolver = require('../');

const loadConfig = require('../../../loadConfig');
const createDb = require('../../../db');

const ADDRESS = '3PHXcxfQGAf3SgGGyg1Vendj5ZvjZxvC6KM';
const ALIAS = 'sexy-boys';

const db = createDb(loadConfig());
const resolverOne = createResolver.one({
  db,
  emitEvent: () => () => null,
});
const resolverMany = createResolver.many({
  db,
  emitEvent: () => () => null,
});

describe('Alias resolver for one', () => {
  it('fetches an alias', async () => {
    const x = await resolverOne(ALIAS)
      .run()
      .promise();
    expect(x).toMatchSnapshot();
  });

  it('returns null for non-existing', async () => {
    const x = await resolverOne('__non-existing__')
      .run()
      .promise();
    expect(x).toBe(null);
  });
});

describe('Alias resolver for many', () => {
  it('fetches aliases for address', async () => {
    const aliasesList = await resolverMany({
      address: ADDRESS,
    })
      .run()
      .promise();
    expect(aliasesList).toMatchSnapshot();
  });
});
