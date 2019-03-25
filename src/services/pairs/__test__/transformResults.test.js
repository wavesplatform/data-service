const {
  transformResult,
  transformResultSearch,
} = require('../transformResult');
const { list, pair } = require('../../../types');

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
      firstPrice: 1.2,
      lastPrice: 2.1,
      volume: 100.1,
      volumeWaves: 10.2,
    });
  });

  it('should return pair with asset and price asset for search pairs', () => {
    expect(
      transformResultSearch([
        {
          amount_asset_id: '111',
          price_asset_id: '222',
          first_price: 1.2,
          last_price: 2.1,
          volume: 100.1,
          volume_waves: 10.2,
        },
      ])
    ).toEqual(
      list([
        {
          ...pair({
            firstPrice: 1.2,
            lastPrice: 2.1,
            volume: 100.1,
            volumeWaves: 10.2,
          }),
          amountAsset: '111',
          priceAsset: '222',
        },
      ])
    );
  });
});
