const Maybe = require('folktale/maybe');

const transformResult = require('../many');

const { txExchange } = require('../../../mocks/exchange');

const txsFromDb = [Maybe.of(txExchange), Maybe.of(txExchange)];

describe('outputTransform', () => {
  it('should create a List(Transaction) object from db array', () => {
    expect(transformResult(txsFromDb, { sort: 'asc' })).toMatchSnapshot();
    expect(transformResult(txsFromDb, { sort: 'desc' })).toMatchSnapshot();
  });
});
