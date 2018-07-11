const createResolver = require('../');

const db = require('../../../../db/__test__/integration/createDb')();

// testnet id
const TX_ID = '2jnH9e2KvEEAiWKHgwocD9arjK3AvBz6DbqwK8GUHdXA';
// this time range contains 8 test txs on testnet
const TIME_START = new Date('2018-06-07 08:26:00');
const TIME_END = new Date('2018-06-07 08:50:00');

const resolverOne = createResolver.one({
  db,
  emitEvent: () => () => null,
});
const resolverMany = createResolver.many({
  db,
  emitEvent: () => () => null,
});

describe('Data transaction resolver for one', () => {
  it('fetches real tx', done => {
    resolverOne(TX_ID)
      .run()
      .listen({
        onResolved: maybeTx => {
          expect(maybeTx).toMatchSnapshot();
          done();
        },
      });
  });
  it('returns null for unreal tx', async () => {
    const tx = await resolverOne('unreal')
      .run()
      .promise();
    expect(tx).toBe(null);
  });
});

describe('Data transaction resolver for many', () => {
  describe('following filter combinations should work:', () => {
    it('timeStart/timeEnd', async () => {
      const txs = await resolverMany({
        timeStart: TIME_START,
        timeEnd: TIME_END,
      })
        .run()
        .promise();

      expect(txs.data).toHaveLength(8);
      expect(txs).toMatchSnapshot();
    });

    it('key', async () => {
      const txs = await resolverMany({
        timeStart: TIME_START,
        timeEnd: TIME_END,
        key: 'max',
      })
        .run()
        .promise();

      expect(txs.data).toHaveLength(4);
      expect(txs).toMatchSnapshot();

      const noTxs = await resolverMany({
        timeStart: TIME_START,
        timeEnd: TIME_END,
        key: 'NON_EXISTING',
      })
        .run()
        .promise();

      expect(noTxs.data).toHaveLength(0);
      expect(noTxs).toMatchSnapshot();
    });

    it('type + value', async () => {
      const txs = await resolverMany({
        timeStart: TIME_START,
        timeEnd: TIME_END,
        type: 'integer',
        value: 101,
      })
        .run()
        .promise();

      expect(txs.data).toHaveLength(1);
      expect(txs).toMatchSnapshot();

      const noTxs = await resolverMany({
        timeStart: TIME_START,
        timeEnd: TIME_END,
        type: 'integer',
        value: -123123, // non-existing
      })
        .run()
        .promise();

      expect(noTxs.data).toHaveLength(0);
      expect(noTxs).toMatchSnapshot();
    });

    it('key + type + value', async () => {
      const txs = await resolverMany({
        timeStart: TIME_START,
        timeEnd: TIME_END,
        key: 'neg',
        type: 'integer',
        value: 101,
      })
        .run()
        .promise();

      expect(txs.data).toHaveLength(1);
      expect(txs).toMatchSnapshot();

      const noTxs = await resolverMany({
        timeStart: TIME_START,
        timeEnd: TIME_END,
        key: 'NON_EXISTING',
        type: 'integer',
        value: -123123, // non-existing
      })
        .run()
        .promise();

      expect(noTxs.data).toHaveLength(0);
      expect(noTxs).toMatchSnapshot();
    });
  });

  describe('Pagination ', async () => {
    const Cursor = require('../pagination/cursor');
    const LIMIT = 8;
    const createCursor = sort => ({ data }) => Cursor.encode(sort, data);
    it(' works asc', async () => {
      const SORT = 'asc';

      const baseParams = {
        limit: LIMIT,
        timeEnd: TIME_END,
        timeStart: TIME_START,
        sort: SORT,
      };

      const fetchAndGetNextCursor = cursor =>
        resolverMany({
          ...baseParams,
          limit: 2,
          after: cursor,
        })
          .run()
          .promise()
          .then(x => [x.lastCursor, x.data.map(createCursor(SORT))]);

      const firstCursor = await resolverMany({ ...baseParams, limit: 1 })
        .run()
        .promise()
        .then(x => x.data.map(createCursor(SORT))[0]);
      var i = 0;
      var cursors = [firstCursor];
      var curCursor = firstCursor;

      while (i++ < (LIMIT - 1) / 2) {
        var [nextCursor, cs] = await fetchAndGetNextCursor(curCursor);
        curCursor = nextCursor;
        cursors = [...cursors, ...cs];
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
        timeEnd: TIME_END,
        timeStart: TIME_START,
        sort: SORT,
      };

      const fetchAndGetNextCursor = cursor =>
        resolverMany({
          ...baseParams,
          limit: 5,
          after: cursor,
        })
          .run()
          .promise()
          .then(x => [x.lastCursor, x.data.map(createCursor(SORT))]);

      const firstCursor = await resolverMany({ ...baseParams, limit: 1 })
        .run()
        .promise()
        .then(x => x.data.map(createCursor(SORT))[0]);
      var i = 0;
      var cursors = [firstCursor];
      var curCursor = firstCursor;

      while (i++ < (LIMIT - 1) / 5) {
        var [nextCursor, curCursors] = await fetchAndGetNextCursor(curCursor);
        curCursor = nextCursor;
        cursors = [...cursors, ...curCursors];
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

    it('doesnt try to create a cursor for empty response', done =>
      resolverMany({
        limit: 1,
        key: 'someKeyThatDoesntExists' + new Date(),
      })
        .run()
        .promise()
        .then(d => {
          expect(d).not.toHaveProperty('lastCursor');
          done();
        })
        .catch(e => done(JSON.stringify(e))));
  });
});
