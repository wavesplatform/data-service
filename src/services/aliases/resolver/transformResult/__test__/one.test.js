const Maybe = require('folktale/maybe');

const { Alias } = require('../../../../../types');
const transformResult = require('../one');

const a = {
  address: '__address__',
  alias: '@alias',
};

describe('outputTransform for one asset', () => {
  it('should create an Alias object from Maybe(alias)', () => {
    expect(transformResult(Maybe.of(a))).toEqual(Alias(a));
  });
  it('should return null if db returns null', () => {
    expect(transformResult(Maybe.empty())).toEqual(null);
  });
});
