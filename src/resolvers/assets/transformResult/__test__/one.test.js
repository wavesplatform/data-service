const { Asset } = require('../../../../types');
const transformResult = require('../one');

const { asset, transformedAsset } = require('../../mocks/asset');

const assetsFromDb = [
  {
    ...asset,
    ticker: null,
  },
];

const assetObject = Asset(transformedAsset);

describe('outputTransform for one asset', () => {
  it('should create an Asset object from db singleton array', () => {
    expect(transformResult(assetsFromDb)).toEqual(assetObject);
  });
  it('should create an empty Asset object if db returns null', () => {
    expect(transformResult([null])).toEqual(null);
  });
});
