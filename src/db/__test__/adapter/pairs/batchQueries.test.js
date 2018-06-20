const { identity, map, path } = require('ramda');

const batchQueries = require('../../../adapter/pairs/batchQueries');
const sql = require('../../../sql');

const tMock = {
  batch: identity,
  oneOrNone: identity,
};

const spiedSql = map(jest.fn, sql.build.pairs);
afterEach(() => {
  jest.clearAllMocks();
});

describe('Pairs createDbTask function', () => {
  const getCalls = spiesObj => map(path(['mock', 'calls']), spiesObj);

  it('covers case when WAVES — amount asset', () => {
    const pair = {
      amountAsset: 'WAVES',
      priceAsset: 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
    };
    batchQueries(spiedSql, pair, tMock);
    expect(getCalls(spiedSql)).toMatchSnapshot();
  });

  it('covers case when WAVES — price asset', () => {
    const pair = {
      amountAsset: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
      priceAsset: 'WAVES',
    };
    batchQueries(spiedSql, pair, tMock);
    expect(getCalls(spiedSql)).toMatchSnapshot();
  });

  it('covers case when WAVES is neither price nor amount asset', () => {
    const pair = {
      amountAsset: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
      priceAsset: 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
    };
    batchQueries(spiedSql, pair, tMock);
    expect(getCalls(spiedSql)).toMatchSnapshot();
  });
});
