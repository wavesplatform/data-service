const sql = require('../../../sql/build/aliases');

describe('Alias sql query build', () => {
  it('`one` should build select by alias', () => {
    expect(sql.one('scam')).toMatchSnapshot();
  });

  it('`many` should build select by address with order by time and hide blocked by default', () => {
    expect(
      sql.many({ address: '3PELiu6JuVMLJojenRkTPTzCRjAocrxXWJy' })
    ).toMatchSnapshot();
  });

  it('`many` should build select by address with order by time and show blocked if flag is set', () => {
    expect(
      sql.many({
        address: '3PELiu6JuVMLJojenRkTPTzCRjAocrxXWJy',
        showBroken: true,
      })
    ).toMatchSnapshot();
  });
});
