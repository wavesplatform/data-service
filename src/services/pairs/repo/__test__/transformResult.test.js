const { transformResult } = require('../transformResult');

describe('sql query results transformation', () => {
  it('should return pair without asset and price asset for get one or many pair', () => {
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
      amountAsset: '111',
      firstPrice: 1.2,
      lastPrice: 2.1,
      priceAsset: '222',
      volume: 100.1,
      volumeWaves: 10.2,
    });
  });
});
