import { get, mget, search } from '../sql';

describe('sql query from pairs', () => {
  it('should get one pair', () => {
    expect(
      get({
        pair: {
          amountAsset: '111',
          priceAsset: '222',
        },
        matcher: '333',
      })
    ).toMatchSnapshot();
  });

  it('should get many pairs', () => {
    expect(
      mget({
        pairs: [
          {
            amountAsset: '111',
            priceAsset: '222',
          },
          {
            amountAsset: '333',
            priceAsset: '444',
          },
        ],
        matcher: '555',
      })
    ).toMatchSnapshot();
  });

  it('should search pairs for one asset', () => {
    expect(
      search({
        search_by_asset: '7FJhS4wyEKqsp77VCMfCZWKLSMuy1TWskYAyZ28amWFj',
        matcher: '',
        limit: 10,
      })
    ).toMatchSnapshot();
  });

  it('should search pairs for one asset exactly', () => {
    expect(
      search({
        search_by_asset: '7FJhS4wyEKqsp77VCMfCZWKLSMuy1TWskYAyZ28amWFj',
        match_exactly: [true],
        matcher: '',
        limit: 10,
      })
    ).toMatchSnapshot();
  });

  it('should search pairs for one asset exactly', () => {
    expect(
      search({
        search_by_asset: '¯\\_(ツ)_/¯',
        match_exactly: [true],
        matcher: '',
        limit: 10,
      })
    ).toMatchSnapshot();
  });

  it('should search pairs for two assets (amount and price)', () => {
    expect(
      search({ search_by_assets: ['BTC', 'WAVES'], matcher: '', limit: 10 })
    ).toMatchSnapshot();
  });

  it('should search pairs for two assets (amount and price)', () => {
    expect(
      search({
        search_by_assets: ['¯\\_(ツ)_/¯', 'WAVES'],
        matcher: '',
        limit: 10,
      })
    ).toMatchSnapshot();
  });

  it('should search pairs for two assets (amount and price)', () => {
    expect(
      search({
        search_by_assets: ['¯\\_(ツ)_/¯', 'WAVES'],
        match_exactly: [true, false],
        matcher: '',
        limit: 10,
      })
    ).toMatchSnapshot();
  });
});
