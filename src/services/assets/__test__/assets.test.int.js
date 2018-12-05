const createService = require('../index');

// dependencies
const { createPgDriver } = require('../../../db');
const loadConfig = require('../../../loadConfig');
const options = loadConfig();
const drivers = {
  pg: createPgDriver(options),
};
const service = createService({
  drivers,
  emitEvent: () => () => null,
});

const assetId = 'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH';

describe('Assets service', () => {
  describe('get', () => {
    it('fetches a real asset', async done => {
      service
        .get(assetId)
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

  describe('mget', () => {
    it('fetches real assets with nulls for unreal', async done => {
      service
        .mget([assetId, 'UNREAL'])
        .run()
        .promise()
        .then(xs => {
          expect(xs).toMatchSnapshot();
          done();
        })
        .catch(e => done(JSON.stringify(e)));
    });
  });

  describe('search', () => {
    it('fetches WAVES by ticker', async done => {
      service
        .search({ ticker: 'WAVES' })
        .run()
        .promise()
        .then(xs => {
          expect(xs).toMatchSnapshot();
          done();
        })
        .catch(e => done(JSON.stringify(e)));
    });

    it('fetches non-WAVES asset by ticker (BTC)', async done => {
      service
        .search({ ticker: 'BTC' })
        .run()
        .promise()
        .then(xs => {
          expect(xs).toMatchSnapshot();
          done();
        })
        .catch(e => done(JSON.stringify(e)));
    });

    it('fetches all assets with tickers by ticker=*', async done => {
      service
        .search({ ticker: '*' })
        .run()
        .promise()
        .then(as => {
          expect(as.data.length).toBeGreaterThan(100);
          // make sure WAVES is included
          expect(
            as.data.find(a => a.data.ticker === 'WAVES')
          ).not.toBeUndefined();
          done();
        })
        .catch(e => done(JSON.stringify(e)));
    });
  });
});
