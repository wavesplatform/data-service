const Maybe = require('folktale/maybe');

const { Transaction } = require('../../../../../types');
const transformResult = require('../one');

const {
  txExchange,
  transformedTxExchange,
} = require('../../../mocks/exchange');

const txFromDb = Maybe.of(txExchange);

const txObject = Transaction(transformedTxExchange);

describe('outputTransform for one tx', () => {
  it('should create an Transaction object from db', () => {
    expect(transformResult(txFromDb)).toEqual(txObject);
  });
  it('should return null if db returns null', () => {
    expect(transformResult(Maybe.empty())).toEqual(null);
  });
});
