const asset = {
  asset_id: 'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
  asset_name: 'ETLxxx',
  description: 'ETLxxx',
  sender: '3P7HKYe6HB8eK7uXxrztEYUSzZQyyYRnWHg',
  issue_height: 238692,
  issue_timestamp: new Date('2016-11-19T19:45:07.000Z'),
  total_quantity: '100000000',
  decimals: 8,
  reissuable: false,
};

const transformedAsset = {
  id: 'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
  name: 'ETLxxx',
  description: 'ETLxxx',
  sender: '3P7HKYe6HB8eK7uXxrztEYUSzZQyyYRnWHg',
  height: 238692,
  timestamp: new Date('2016-11-19T19:45:07.000Z'),
  quantity: '100000000',
  precision: 8,
  reissuable: false,
};

module.exports = {
  asset,
  transformedAsset,
};
