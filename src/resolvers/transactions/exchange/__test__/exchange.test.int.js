const createResolver = require('../');

const loadConfig = require('../../../../loadConfig');
const createDb = require('../../../../db/index');
const { parseDate } = require('../../../../utils/parseDate');
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

  it('fails if timeEnd < 0', done =>
    resolverMany({
      matcher: '3PJaDyprvekvPXPuAtxrapacuDJopgJRaU3',
      sender: '3PEDGbdcSYAorLoV4oDVSJPTezGUPFrZj8f',
      timeEnd: parseDate('-1525132900000'),
      amountAsset: 'B3uGHFRpSUuGEDWjqB9LWWxafQj8VTvpMucEyoxzws5H',
      limit: 100,
      timeStart: parseDate('1525132800000'),
      priceAsset: 'WAVES',
    })
      .run()
      .promise()
      .then(() => done('Wrong branch, error'))
      .catch(e => {
        expect(e.type).toBe('ValidationError');
        done();
      }));
  it('fails if timeStart < 0', done =>
    resolverMany({
      matcher: '3PJaDyprvekvPXPuAtxrapacuDJopgJRaU3',
      sender: '3PEDGbdcSYAorLoV4oDVSJPTezGUPFrZj8f',
      timeEnd: parseDate('1525132900000'),
      amountAsset: 'B3uGHFRpSUuGEDWjqB9LWWxafQj8VTvpMucEyoxzws5H',
      limit: 100,
      timeStart: parseDate('-1525132800000'),
      priceAsset: 'WAVES',
    })
      .run()
      .promise()
      .then(() => done('Wrong branch, error'))
      .catch(e => {
        expect(e.type).toBe('ValidationError');
        done();
      }));
  it('fails if timeEnd < timeStart', done =>
    resolverMany({
      matcher: '3PJaDyprvekvPXPuAtxrapacuDJopgJRaU3',
      sender: '3PEDGbdcSYAorLoV4oDVSJPTezGUPFrZj8f',
      timeEnd: parseDate('1525132700000'),
      amountAsset: 'B3uGHFRpSUuGEDWjqB9LWWxafQj8VTvpMucEyoxzws5H',
      limit: 100,
      timeStart: parseDate('1525132800000'),
      priceAsset: 'WAVES',
    })
      .run()
      .promise()
      .then(() => done('Wrong branch, error'))
      .catch(e => {
        expect(e.type).toBe('ValidationError');
        done();
      }));
  it('fails if timeStart->invalid Date', done =>
    resolverMany({
      matcher: '3PJaDyprvekvPXPuAtxrapacuDJopgJRaU3',
      sender: '3PEDGbdcSYAorLoV4oDVSJPTezGUPFrZj8f',
      amountAsset: 'B3uGHFRpSUuGEDWjqB9LWWxafQj8VTvpMucEyoxzws5H',
      limit: 100,
      timeStart: parseDate(''),
      priceAsset: 'WAVES',
    })
      .run()
      .promise()
      .then(() => done('Wrong branch, error'))
      .catch(e => {
        expect(e.type).toBe('ValidationError');
        done();
      }));
  it('works if only timeEnd is presented', done =>
    resolverMany({
      matcher: '3PJaDyprvekvPXPuAtxrapacuDJopgJRaU3',
      sender: '3PEDGbdcSYAorLoV4oDVSJPTezGUPFrZj8f',
      amountAsset: 'B3uGHFRpSUuGEDWjqB9LWWxafQj8VTvpMucEyoxzws5H',
      limit: 100,
      timeEnd: parseDate('1525132800000'),
      priceAsset: 'WAVES',
    })
      .run()
      .promise()
      .then(() => done())
      .catch(() => done('Wrong branch, error')));
});
