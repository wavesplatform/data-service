const { createPgDriver } = require('../../../db');
const loadConfig = require('../../../loadConfig');
const options = loadConfig();
const create = require('../index');

const amountAsset = 'AnERqFRffNVrCbviXbDEdzrU6ipXCP5Y1PKpFdRnyQAy';
const priceAsset = 'WAVES';

describe('Candles', () => {
  const service = create({
    drivers: { pg: createPgDriver(options) },
    emitEvent: () => () => null,
  });

  describe('search all candles between 2017-04-03 00:00:00 and 2017-04-03 23:59:59', () => {
    it('should return all Candles correctly for each 1h', done => {
      service
        .search({
          amountAsset,
          priceAsset,
          params: {
            timeStart: new Date('2017-04-03T00:00:00.000Z'),
            timeEnd: new Date('2017-04-03T23:59:59.999Z'),
            interval: '1h',
          },
        })
        .run()
        .listen({
          onResolved: value => {
            expect(value).toMatchSnapshot();
            done();
          }
        });
    });

    it('should return all Candles correctly for each 1d', done => {
      service
        .search({
          amountAsset,
          priceAsset,
          params: {
            timeStart: new Date('2017-04-03T00:00:00.000Z'),
            timeEnd: new Date('2017-04-03T23:59:59.999Z'),
            interval: '1d',
          },
        })
        .run()
        .listen({
          onResolved: value => {
            expect(value).toMatchSnapshot();
            done();
          }
        });
    });
  });
});
