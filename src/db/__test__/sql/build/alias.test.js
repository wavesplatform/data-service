const sql = require('../../../sql/build/aliases');

describe('Alias sql query build', () => {
  it('`one` should build select by alias', () => {
    expect(sql.one('SOME_ALIAS')).toMatchSnapshot();
  });

  it('`many` should build select by address with order by time', () => {
    expect(sql.many({ address: 'SOME_ADDRESS' })).toMatchSnapshot();
  });
});
