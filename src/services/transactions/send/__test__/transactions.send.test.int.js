const createService = require('..');
const { createPgDriver } = require('../../../../db');

// first ID has 12 txs with it
const TX_ID = '5jpwaJnERa8Gr1ChgrNYnmxm2EtZ4KHC5bW1ZLL7LCY1bUV9gFWFAGjpJaPDCawmFzguqGBgYDyeocpEsKWeYDM1';
const TX_ID_2 = '119tSRyy2sAFcAS5Htb6m4FtsCtJsacAwarg75WpsAf9HgMJnpvgcLou31ARxxEp1WMuTmGTRNUeghCgrS4PxDT';

const loadConfig = require('../../../../loadConfig');
const options = loadConfig();

const drivers = {
  pg: createPgDriver(options),
};

const service = createService({
  drivers,
  emitEvent: () => () => null,
});

describe('Send transaction service', () => {
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
