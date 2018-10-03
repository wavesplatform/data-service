const createService = require('..');
const { createPgDriver } = require('../../../../db');
const { parseDate } = require('../../../../utils/parseDate');
const Cursor = require('../../../../resolvers/pagination/cursor');

const TX_ID = '8W9BkioPSWmPfDjcTFGaCy8vLEmcwkzJeSWno1s3Wra7'; // tx 4
const TX_ID_2 = 'CPf7EWE4hPrBNKJpzBtBm9os4UsyZ8Eebhzwq4EqLWqG'; // tx 7
const TX_ID_3 = '23sjEq5zNctBTGqrsapLrPxDkHFM8rJCKF1ti55NRpbF'; // tx 12

const loadConfig = require('../../../../loadConfig');
const options = loadConfig();

const drivers = {
  pg: createPgDriver(options),
};

const service = createService({
  drivers,
  emitEvent: () => () => null,
});

describe('All transactions resolver for one', () => {
  it('fetches real transfer tx', async done => {
    service
      .get(TX_ID)
      .run()
      .promise()
      .then(() => done())
      .catch(e => done(JSON.stringify(e)));
  });
  it('fetches real exchange tx', async done => {
    service
      .get(TX_ID_2)
      .run()
      .promise()
      .then(() => done())
      .catch(e => done(JSON.stringify(e)));
  });
  it('fetches real data tx', async done => {
    service
      .get(TX_ID_3)
      .run()
      .promise()
      .then(() => done())
      .catch(e => done(JSON.stringify(e)));
  });
  it('returns null for unreal tx', async () => {
    const tx = await service
      .get('UNREAL')
      .run()
      .promise();

    expect(tx).toBe(null);
  });
});

describe('All transactions resolver for many', () => {
  it('fetches real tx', async () => {
    const txs = await service
      .search({ limit: 20, sort: 'asc' })
      .run()
      .promise();

    expect(txs).toBeDefined();
    expect(txs.data).toHaveLength(20);
    expect(txs).toMatchSnapshot();
  });

  describe('Pagination ', async () => {
    const START = '2018-07-01T00:00:00.000Z';
    const END = '2018-10-01T00:00:00.000Z';
    const LIMIT = 21;
    const createCursor = sort => ({ data }) => Cursor.encode(sort, data);
    it('doesnt get 2 identical entries for limit 1 asc with next page fetching', async () => {
      const baseParams = {
        limit: 1,
        timeStart: parseDate(START),
        sort: 'asc',
      };

      const firstTx = await service
        .search(baseParams)
        .run()
        .promise();

      const secondTx = await service
        .search({
          after: firstTx.lastCursor,
          limit: 1,
        })
        .run()
        .promise();

      expect(firstTx.data).not.toEqual(secondTx.data);
    });
    it(' works asc', async () => {
      const SORT = 'asc';

      const baseParams = {
        limit: LIMIT,
        timeEnd: parseDate(END),
        timeStart: parseDate(START),
        sort: SORT,
      };

      const fetchAndGetNextCursor = cursor =>
        service
          .search({
            ...baseParams,
            limit: 5,
            after: cursor,
          })
          .run()
          .promise()
          .then(x => [x.lastCursor, x.data.map(createCursor(SORT))]);

      const firstCursor = await service
        .search({ ...baseParams, limit: 1 })
        .run()
        .promise()
        .then(x => x.data.map(createCursor(SORT))[0]);
      var i = 0;
      var cursors = [firstCursor];
      var curCursor = firstCursor;

      while (i++ < (LIMIT - 1) / 5) {
        var [nextCursor, cs] = await fetchAndGetNextCursor(curCursor);
        curCursor = nextCursor;
        cursors = [...cursors, ...cs];
      }

      const expectedCursors = await service
        .search({
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
        service
          .search({
            ...baseParams,
            limit: 5,
            after: cursor,
          })
          .run()
          .promise()
          .then(x => [x.lastCursor, x.data.map(createCursor(SORT))]);

      const firstCursor = await service
        .search({ ...baseParams, limit: 1 })
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

      const expectedCursors = await service
        .search({
          ...baseParams,
          limit: LIMIT,
        })
        .run()
        .promise()
        .then(x => x.data.map(createCursor(SORT)));

      expect(cursors).toEqual(expectedCursors);
    });
  });

  it('fails if timeEnd < 0', done =>
    service
      .search({
        timeEnd: parseDate('-1525132900000'),
      })
      .run()
      .promise()
      .then(() => done('Wrong branch, error'))
      .catch(e => {
        expect(e.type).toBe('ValidationError');
        done();
      }));
  it('fails if timeStart < 0', done =>
    service
      .search({
        timeEnd: parseDate('1525132900000'),
        timeStart: parseDate('-1525132800000'),
      })
      .run()
      .promise()
      .then(() => done('Wrong branch, error'))
      .catch(e => {
        expect(e.type).toBe('ValidationError');
        done();
      }));
  it('fails if timeEnd < timeStart', done =>
    service
      .search({
        timeEnd: parseDate('1525132700000'),
        timeStart: parseDate('1525132800000'),
      })
      .run()
      .promise()
      .then(() => done('Wrong branch, error'))
      .catch(e => {
        expect(e.type).toBe('ValidationError');
        done();
      }));
  it('fails if timeStart->invalid Date', done =>
    service
      .search({
        timeStart: parseDate(''),
      })
      .run()
      .promise()
      .then(() => done('Wrong branch, error'))
      .catch(e => {
        expect(e.type).toBe('ValidationError');
        done();
      }));

  it('doesnt try to create a cursor for empty response', done =>
    service
      .search({
        limit: 1,
        timeEnd: parseDate('1'),
      })
      .run()
      .promise()
      .then(d => {
        expect(d).not.toHaveProperty('lastCursor');
        done();
      })
      .catch(e => done(JSON.stringify(e, null, 2))));
});
