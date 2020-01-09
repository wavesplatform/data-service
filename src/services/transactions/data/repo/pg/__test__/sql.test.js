const sql = require('../sql');

describe('transactions.data api method', () => {
  it('get matches snapshot', () => {
    expect(
      sql.get('2jnH9e2KvEEAiWKHgwocD9arjK3AvBz6DbqwK8GUHdXA')
    ).toMatchSnapshot();
  });

  it('mget matches snapshot', () => {
    expect(sql.mget(['id1', 'id2'])).toMatchSnapshot();
  });

  describe('search matches snapshots with', () => {
    it('no params', () => {
      expect(sql.search()).toMatchSnapshot();
    });

    it('timeStart filter', () => {
      expect(
        sql.search({ timeStart: new Date('2018-01-01') })
      ).toMatchSnapshot();
    });

    it('timeEnd filter', () => {
      expect(sql.search({ timeEnd: new Date('2018-01-02') })).toMatchSnapshot();
    });

    it('key filter', () => {
      expect(sql.search({ key: 'testboolF' })).toMatchSnapshot();
    });

    it('type and value', () => {
      expect(sql.search({ type: 'integer', value: 11 })).toMatchSnapshot();
    });

    it('sort desc', () => {
      expect(sql.search({ sort: 'desc' })).toMatchSnapshot();
    });

    it('limit', () => {
      expect(sql.search({ limit: 11 })).toMatchSnapshot();
    });
    it('after', () => {
      expect(
        sql.search({
          after: {
            timestamp: new Date('2018-04-07T08:36:52.149Z'),
            id: '23sjEq5zNctBTGqrsapLrPxDkHFM8rJCKF1ti55NRpbF',
            sortDirection: 'asc',
          },
        })
      ).toMatchSnapshot();
    });
  });
});
