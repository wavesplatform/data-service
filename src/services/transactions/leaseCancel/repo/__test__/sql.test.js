const sql = require('../sql');
const filterValues = {
  // default values
  sort: 'desc',
  limit: 100,
  // for test
  recipient: 'recipient',
};

describe('Sql search by type-specific filters', () => {
  it('supports recipient filter', () => {
    expect(sql.search(filterValues)).toMatchSnapshot();
  });
});
