const { Asset, List } = require('../../types');
const transformResult = require('./transformResult');

const assetsFromDb = [
  {
    asset_id: 'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
    ticker: null,
    asset_name: 'ETLxxx',
    description: 'ETLxxx',
    sender: '3P7HKYe6HB8eK7uXxrztEYUSzZQyyYRnWHg',
    issue_height: 238692,
    issue_timestamp: '2016-11-19T19:45:07.000Z',
    total_quantity: '100000000',
    decimals: 8,
    reissuable: false,
  },
  null,
];

const assetList = List([
  Asset({
    id: 'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
    name: 'ETLxxx',
    description: 'ETLxxx',
    sender: '3P7HKYe6HB8eK7uXxrztEYUSzZQyyYRnWHg',
    height: 238692,
    timestamp: '2016-11-19T19:45:07.000Z',
    quantity: '100000000',
    precision: 8,
    reissuable: false,
  }),
  Asset(null),
]);

describe('outputTransform', () => {
  it('should create an Asset object from db object', () => {
    expect(transformResult(assetsFromDb)).toEqual(assetList);
  });
});
