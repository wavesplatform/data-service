const sql = require('../sql');
const filterValues = {
  amountAsset: 'amountAsset',
  priceAsset: 'priceAsset',
  matcher: 'matcher',
  sender: 'sender',
};

test('Sql search supports type-specific filters', () => {
  expect(sql.search(filterValues)).toMatchSnapshot();
});
