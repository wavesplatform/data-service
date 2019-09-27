const createService = require('..').default;
const { createPgDriver } = require('../../../../db');
const { parseDate } = require('../../../../utils/parseDate');
const { encode } = require('../../../_common/pagination/cursor');

const { loadConfig } = require('../../../../loadConfig');
const options = loadConfig();

const drivers = {
  pg: createPgDriver(options),
};

const service = createService({
  drivers,
  emitEvent: () => () => null,
});

describe('Genesis transaction service', () => {
  describe('search', () => {
    it('fetches all 6 genesis txs', async () => {
      const tx = await service
        .search({ limit: 20, sort: 'asc' })
        .run()
        .promise();

      expect(tx).toBeDefined();
      expect(tx.data).toHaveLength(6);
    }, 10000);

    describe('Pagination ', () => {
      const createCursor = sort => ({ id, timestamp }) =>
        encode({ sort, id, timestamp });

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

      const assertPagination = async sort => {
        const LIMIT = 3;

        const firstThree = await service
          .search({
            limit: LIMIT,
            sort,
          })
          .run()
          .promise();

        const secondThree = await service
          .search({
            limit: LIMIT,
            sort,
            after: createCursor(sort)(firstThree.data[2].data),
          })
          .run()
          .promise();

        expect([...firstThree.data, secondThree.data]).toMatchSnapshot();
      };

      it('works asc', () => assertPagination('asc'));
      it('works desc', () => assertPagination('desc'));

      it('doesnt try to create a cursor for empty response', done =>
        service
          .search({
            limit: 1,
            timeEnd: parseDate('1').unsafeGet(),
          })
          .run()
          .promise()
          .then(d => {
            expect(d).not.toHaveProperty('lastCursor');
            done();
          })
          .catch(e => done(JSON.stringify(e, null, 2))));
    });
  });
});
