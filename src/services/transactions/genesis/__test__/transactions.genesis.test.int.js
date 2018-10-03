const createService = require('..');
const { createPgDriver } = require('../../../../db');

const TX_ID = '2DVtfgXjpMeFf2PQCqvwxAiaGbiDsxDjSdNQkc5JQ74eWxjWFYgwvqzC4dn7iB1AhuM32WxEiVi1SGijsBtYQwn8';
const TX_ID_2 = '2TsxPS216SsZJAiep7HrjZ3stHERVkeZWjMPFcvMotrdGpFa6UCCmoFiBGNizx83Ks8DnP3qdwtJ8WFcN9J4exa3';

const loadConfig = require('../../../../loadConfig');
const options = loadConfig();

const drivers = {
  pg: createPgDriver(options),
};

const service = createService({
  drivers,
  emitEvent: () => () => null,
});

describe('Genesis transaction service', () => {
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
