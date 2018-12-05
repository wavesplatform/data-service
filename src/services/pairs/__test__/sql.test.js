const sql = require('../sql');

describe('sql query from pairs', () => {
  it('should get one pairs', () => {
    expect(
      sql.get({
        amountAsset: '111',
        priceAsset: '222',
      })
    ).toMatchSnapshot();
  });

  it('should get many pairs', () => {
    expect(
      sql.mget([
        {
          amountAsset: '111',
          priceAsset: '222',
        },
        {
          amountAsset: '333',
          priceAsset: '444',
        },
      ])
    ).toMatchSnapshot();
  });
});
