const selectQuery = require('../../../adapter/pairs/selectQuery');
const sql = require('../../../sql');

describe('Pair db adapter `selectQuery` function', () => {
  it('covers case when WAVES — amount asset', () => {
    const pair = {
      amountAsset: 'WAVES',
      priceAsset: 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
    };
    expect(selectQuery(sql.build.pairs, pair)).toEqual(
      sql.build.pairs.query(pair)
    );
  });

  it('covers case when WAVES — price asset', () => {
    const pair = {
      amountAsset: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
      priceAsset: 'WAVES',
    };
    expect(selectQuery(sql.build.pairs, pair)).toEqual(
      sql.build.pairs.query(pair)
    );
  });

  it('covers case when WAVES is neither price nor amount asset', () => {
    const pair = {
      amountAsset: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
      priceAsset: 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
    };
    expect(selectQuery(sql.build.pairs, pair)).toEqual(
      sql.build.pairs.queryWithWaves(pair)
    );
  });
});
