const { Asset, List } = require('../../../../types');
const transformResult = require('../many');

const { asset, transformedAsset } = require('../../mocks/asset');

const assetsFromDb = [
  {
    ...asset,
    ticker: null,
  },
  null,
];

const assetList = List([Asset(transformedAsset), Asset(null)]);

describe('outputTransform', () => {
  it('should create an Asset object from db object', () => {
    expect(transformResult(assetsFromDb)).toEqual(assetList);
  });
});
