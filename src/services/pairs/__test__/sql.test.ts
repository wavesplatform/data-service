import { get, mget, search } from '../sql';

describe('sql query from pairs', () => {
  it('should get one pair', () => {
    expect(
      get({
        amountAsset: '111',
        priceAsset: '222',
      })
    ).toMatchSnapshot();
  });

  it('should get many pairs', () => {
    expect(
      mget([
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

  it('should search pairs for one asset', () => {
    expect(
      search({
        search: '7FJhS4wyEKqsp77VCMfCZWKLSMuy1TWskYAyZ28amWFj',
        limit: 10,
      })
    ).toMatchSnapshot();
  });

  it('should search pairs for one asset exactly', () => {
    expect(
      search({
        search: '7FJhS4wyEKqsp77VCMfCZWKLSMuy1TWskYAyZ28amWFj/',
        limit: 10,
      })
    ).toMatchSnapshot();
  });

  it('should search pairs for two assets (amount and price)', () => {
    expect(search({ search: 'BTC/WAVES', limit: 10 })).toMatchSnapshot();
  });
});
