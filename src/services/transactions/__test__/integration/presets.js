const { parseDate } = require('../../../../utils/parseDate');
const Cursor = require('../../../_common/pagination/cursor');

const get = (service, txId) =>
  describe('get', () => {
    it('fetches real tx', async done => {
      service
        .get(txId)
        .run()
        .promise()
        .then(x => {
          expect(x).toMatchSnapshot();
          done();
        })
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

const mget = (service, txIds) =>
  describe('mget', () => {
    it('fetches real txs with nulls for unreal', async done => {
      service
        .mget([...txIds, 'UNREAL'])
        .run()
        .promise()
        .then(xs => {
          expect(xs).toMatchSnapshot();
          done();
        })
        .catch(e => done(JSON.stringify(e)));
    });
  });

const search = service =>
  describe('search', () => {
    it(
      'fetches real txs',
      async () => {
        const tx = await service
          .search({ limit: 20, sort: 'asc' })
          .run()
          .promise();
        expect(tx).toBeDefined();
        expect(tx.data).toHaveLength(20);
      },
      10000
    );

    describe('Pagination ', async () => {
      const LIMIT = 21;
      const createCursor = sort => ({ data }) => Cursor.encode(sort, data);
      it('doesnt get 2 identical entries for limit 1 asc with next page fetching', async () => {
        const baseParams = {
          limit: 1,
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

      it('works asc', async () => {
        const SORT = 'asc';

        const baseParams = {
          limit: LIMIT,
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

      it('works desc', async () => {
        const SORT = 'desc';

        const baseParams = {
          limit: LIMIT,
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

module.exports = {
  get,
  mget,
  search,
};
