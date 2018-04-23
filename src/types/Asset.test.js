const Asset = require('./Asset');

const asset = { id: 'qwe', timestamp: new Date() };

test('Asset type object should be constructed from raw data', () => {
  expect(Asset(asset)).toEqual({
    __type: 'asset',
    data: asset,
  });
});
