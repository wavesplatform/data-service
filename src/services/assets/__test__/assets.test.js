const { get, mget, search } = require('../sql');

describe('Assets SQL queries tests', () => {
  it('should build correct get sql query', () => {
    expect(get('123')).toMatchSnapshot();
  });

  it('should build correct mget sql query', () => {
    expect(mget(['1', '2', '3'])).toMatchSnapshot();
  });

  it('should build correct search sql query', () => {
    expect(search({ ticker: '*' })).toMatchSnapshot();
  });

  it('should build correct search sql query', () => {
    expect(search({ ticker: 'BTC' })).toMatchSnapshot();
  });

  it('should build correct search sql query', () => {
    expect(search({ search: 'BIT' })).toMatchSnapshot();
  });

  it('should build correct search sql query', () => {
    expect(search({ search: 'bitcoin cas' })).toMatchSnapshot();
  });

  it('should build correct search sql query', () => {
    expect(search({ search: 'BIT', after: 'FiKAykpjAFkiukke7ZpVX511HHumPZYKyu6GXokPEkcT', limit: 3 })).toMatchSnapshot();
  });
});
