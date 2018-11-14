const Maybe = require('folktale/maybe');

const { Alias, List } = require('../../../../../types');
const transformResult = require('../many');

const a = {
  address: '__address__',
  alias: '@alias',
};

const as = [Maybe.of(a), Maybe.Nothing()];
const asList = List([Alias(a), Alias()]);

describe('outputTransform', () => {
  it('should create an Asset object from db object', () => {
    expect(transformResult(as)).toEqual(asList);
  });
});
