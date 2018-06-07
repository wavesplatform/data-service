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
  it('fetches real tx', async done => {
    resolverOne(TX_ID)
      .run()
      .promise()
      .then(() => done())
      .catch(e => done(JSON.stringify(e)));
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
  describe('Pagination ', async () => {
    const Cursor = require('../pagination/cursor');
    const { parseDate } = require('../../../../utils/parseDate');
    const START = '2018-06-02T10:59:43.000Z';
    const END = '2018-06-03T23:59:48.000Z';
    const LIMIT = 10;
    const createCursor = sort => ({ data }) => Cursor.encode(sort, data);
    it(' works asc', async () => {
      const SORT = 'asc';

      const baseParams = {
        limit: LIMIT,
        timeEnd: parseDate(END),
        timeStart: parseDate(START),
        sort: SORT,
      };

      const fetchAndGetNextCursor = cursor =>
        resolverMany({
          ...baseParams,
          limit: 1,
          after: cursor,
        })
          .run()
          .promise()
          .then(x => x.lastCursor);

      const firstCursor = await resolverMany({ ...baseParams, limit: 1 })
        .run()
        .promise()
        .then(x => x.data.map(createCursor(SORT))[0]);
      var i = 0;
      var cursors = [firstCursor];
      var curCursor = firstCursor;

      while (i++ < LIMIT - 1) {
        curCursor = await fetchAndGetNextCursor(curCursor);
        cursors.push(curCursor);
      }

      const expectedCursors = await resolverMany({
        ...baseParams,
        limit: LIMIT,
      })
        .run()
        .promise()
        .then(x => x.data.map(createCursor(SORT)));

      expect(cursors).toEqual(expectedCursors);
    });
    it(' works desc', async () => {
      const SORT = 'desc';

      const baseParams = {
        limit: LIMIT,
        timeEnd: parseDate(END),
        timeStart: parseDate(START),
        sort: SORT,
      };

      const fetchAndGetNextCursor = cursor =>
        resolverMany({
          ...baseParams,
          limit: 1,
          after: cursor,
        })
          .run()
          .promise()
          .then(x => x.lastCursor);

      const firstCursor = await resolverMany({ ...baseParams, limit: 1 })
        .run()
        .promise()
        .then(x => x.data.map(createCursor(SORT))[0]);
      var i = 0;
      var cursors = [firstCursor];
      var curCursor = firstCursor;

      while (i++ < LIMIT - 1) {
        curCursor = await fetchAndGetNextCursor(curCursor);
        cursors.push(curCursor);
      }

      const expectedCursors = await resolverMany({
        ...baseParams,
        limit: LIMIT,
      })
        .run()
        .promise()
        .then(x => x.data.map(createCursor(SORT)));

      expect(cursors).toEqual(expectedCursors);
    });
  });
});
