const Maybe = require('folktale/maybe');

const { Transaction, List } = require('../../../../../types');
const transformResult = require('../many');

const {
  txExchange,
  transformedTxExchange,
} = require('../../../mocks/exchange');

const txsFromDb = [Maybe.of(txExchange), Maybe.Nothing()];

const txList = List([Transaction(transformedTxExchange), Transaction()]);

describe('outputTransform', () => {
  it('should create a List(Transaction) object from db array', () => {
    expect(transformResult(txsFromDb)).toEqual(txList);
  });
});
