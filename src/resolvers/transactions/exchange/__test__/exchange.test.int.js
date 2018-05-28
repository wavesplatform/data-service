const createResolver = require('../');

const loadConfig = require('../../../../loadConfig');
const createDb = require('../../../../db/index');

const TX_ID = '8rEwYY4wQ4bkEkk95EiyeQnvnonX6TAnU6eiBAbVSADk';
const YESTERDAY = new Date(Date.now() - 60 * 60 * 24 * 1000);

const db = createDb(loadConfig());
const resolverOne = createResolver.one({
  db,
  emitEvent: () => () => null,
});
const resolverMany = createResolver.many({
  db,
  emitEvent: () => () => null,
});

describe('Exchange transaction resolver for one', () => {
  it('fetches real tx', async () => {
    const tx = await resolverOne(TX_ID)
      .run()
      .promise();

    expect(tx).toBeDefined();
  });
  it('returns null for unreal tx', async () => {
    const tx = await resolverOne('unreal')
      .run()
      .promise();

    expect(tx).toBe(null);
  });
});
describe('Exchange transaction resolver for many', () => {
  it('fetches real tx', async () => {
    const tx = await resolverMany({
      limit: 20,
      timeStart: YESTERDAY,
    })
      .run()
      .promise();
    expect(tx).toBeDefined();
    expect(tx.data).toHaveLength(20);
  });
});
