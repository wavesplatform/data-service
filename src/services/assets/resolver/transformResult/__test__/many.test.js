const Maybe = require('folktale/maybe');

const { Asset, List } = require('../../../../../types');
const transformResult = require('../many');

const { asset, transformedAsset } = require('./mocks');

const assetsFromDb = [
  Maybe.of({
    ...asset,
    ticker: null,
  }),
  Maybe.Nothing(),
];

const assetList = List([Asset(transformedAsset), Asset()]);

describe('outputTransform', () => {
  it('should create an Asset object from db object', () => {
    expect(transformResult(assetsFromDb)).toEqual(assetList);
  });
});
