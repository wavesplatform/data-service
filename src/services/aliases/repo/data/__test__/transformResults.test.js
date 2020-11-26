const { transformDbResponse: transformResult } = require('../transformResult');

describe('sql query results transformation', () => {
  it('alias with one address (duplicates equals to 0)', () => {
    expect(
      transformResult({ alias: 'qwerty', address: 'qwerty', duplicates: 0 })
    ).toEqual({ alias: 'qwerty', address: 'qwerty' });
  });

  it('alias with many addresses (duplicates more then 0)', () => {
    expect(
      transformResult({ alias: 'qwerty', address: 'qwerty', duplicates: 2 })
    ).toEqual({ alias: 'qwerty', address: null });
  });
});
