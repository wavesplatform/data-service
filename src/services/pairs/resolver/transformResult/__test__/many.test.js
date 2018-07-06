const Maybe = require('folktale/maybe');

const { Pair, List } = require('../../../../../types');
const transformResult = require('../many');

const { pair, transformedPair } = require('./mocks/pair');

const pairsFromDb = [Maybe.of(pair), Maybe.Nothing()];

const pairList = List([Pair(transformedPair), Pair()]);

describe('outputTransform', () => {
  it('should create an Pair object from db object', () => {
    expect(transformResult(pairsFromDb)).toEqual(pairList);
  });
});
