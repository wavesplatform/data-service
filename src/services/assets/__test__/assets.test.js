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
});
