const transformResult = require('../transformResult');

describe('sql query results transformation', () => {
  it('pair without asset and price asset', () => {
    expect(
      transformResult({
        amount_asset_id: '111',
        price_asset_id: '222',
        first_price: 1.2,
        last_price: 2.1,
        volume: 100.1,
        volume_waves: 10.2,
      })
    ).toEqual({
      firstPrice: 1.2,
      lastPrice: 2.1,
      volume: 100.1,
      volumeWaves: 10.2,
    });
  });
});
