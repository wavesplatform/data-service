import { interval as intervalFromString } from '../../../../../types/interval';
import { sql } from '../sql';

describe('sql query from candles', () => {
  it('should search candles for 1h', () => {
    expect(
      sql({
        amountAsset: '111',
        priceAsset: '222',
        timeStart: new Date('2017-04-03T00:00:00.000Z'),
        timeEnd: new Date('2017-04-03T23:59:59.999Z'),
        interval: intervalFromString('1h').unsafeGet(),
        matcher: '123',
      })
    ).toMatchSnapshot();
  });

  it('should search candles for 1d', () => {
    expect(
      sql({
        amountAsset: '111',
        priceAsset: '222',
        timeStart: new Date('2017-04-03T00:00:00.000Z'),
        timeEnd: new Date('2017-04-03T23:59:59.999Z'),
        interval: intervalFromString('1d').unsafeGet(),
        matcher: '123',
      })
    ).toMatchSnapshot();
  });

  it('should search candles for 1m', () => {
    expect(
      sql({
        amountAsset: '111',
        priceAsset: '222',
        timeStart: new Date('2017-04-03T00:00:00.000Z'),
        timeEnd: new Date('2017-04-03T23:59:59.999Z'),
        interval: intervalFromString('1m').unsafeGet(),
        matcher: '123',
      })
    ).toMatchSnapshot();
  });
});
