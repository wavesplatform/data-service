const Maybe = require('folktale/maybe');

const transformResult = require('../one');

const { txExchange } = require('../../../mocks/exchange');

const txFromDb = Maybe.of(txExchange);

describe('outputTransform for one tx', () => {
  it('should create an Transaction object from db', () => {
    expect(transformResult(txFromDb)).toMatchSnapshot();
  });
  it('should return null if db returns null', () => {
    expect(transformResult(Maybe.empty())).toEqual(null);
  });
});
