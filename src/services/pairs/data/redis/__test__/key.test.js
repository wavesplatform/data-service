const getKey = require('../key');

describe('Redis key encoding', () => {
  it('should correctly encode a pair', () => {
    const pair = {
      amountAsset: 'AMOUNT_ASSET_ID',
      priceAsset: 'PRICE_ASSET_ID',
    };
    expect(getKey(pair)).toEqual('pair:AMOUNT_ASSET_ID/PRICE_ASSET_ID');
  });

  it('throws on bad inputs', () => {
    expect(() => getKey(undefined)).toThrow(
      'Error creating redis key for pair undefined'
    );

    expect(() => getKey(null)).toThrow(
      'Error creating redis key for pair null'
    );
  });
});
