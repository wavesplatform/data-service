const sql = require('../');

const filterValues = {
  recipient: 'recipient',
  assetId: 'assetId',
};

test('Sql search supports type-specific filters', () => {
  expect(sql.search(filterValues)).toMatchSnapshot();
});
