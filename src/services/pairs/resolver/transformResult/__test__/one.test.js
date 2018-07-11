const Maybe = require('folktale/maybe');

const { Pair } = require('../../../../../types');
const transformResult = require('../one');

const { pair, transformedPair } = require('./mocks/pair');

const pairsFromDb = Maybe.of(pair);

const pairObject = Pair(transformedPair);

describe('outputTransform for one pair', () => {
  it('should create an Asset object from db singleton array', () => {
    expect(transformResult(pairsFromDb)).toEqual(pairObject);
  });
  it('should return null if db returns null', () => {
    expect(transformResult(Maybe.empty())).toEqual(null);
  });
});
