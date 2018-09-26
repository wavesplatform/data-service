const createService = require('..');
const { createPgDriver } = require('../../../../db');

// both broken aliases, have 3 txs each on this ID
const TX_ID = '21BmkGpk98wWHrCydjwTFvHWPfQxtH5NEQd9X7wUpi5R';
const TX_ID_2 = 'HbgSfoQ7ftAF3TUQNovbFnohsRK7AdztFznrJHTqH7F7';

const loadConfig = require('../../../../loadConfig');
const options = loadConfig();

const drivers = {
  pg: createPgDriver(options),
};

const service = createService({
  drivers,
  emitEvent: () => () => null,
});

describe('Alias transaction service', () => {
  describe('get', () => {
    it('fetches real tx', async done => {
      service
        .get(TX_ID)
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
    it('fetches real txs with nulls for unreal', async done => {
      service
        .mget([TX_ID, 'UNREAL', TX_ID_2])
        .run()
        .promise()
        .then(xs => {
          expect(xs).toMatchSnapshot();
          done();
        })
        .catch(e => done(JSON.stringify(e)));
    });
  });
});
