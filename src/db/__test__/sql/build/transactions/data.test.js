const sql = require('../../../../sql/build/transactions/data');

describe('transactions.data api method', () => {
  it('`one` matches snapshot', () => {
    expect(
      sql.one('2jnH9e2KvEEAiWKHgwocD9arjK3AvBz6DbqwK8GUHdXA')
    ).toMatchSnapshot();
  });

  describe('many matches snapshot with', () => {
    it('no params', () => {
      expect(sql.many()).toMatchSnapshot();
    });

    it('timeStart filter', () => {
      expect(sql.many({ timeStart: new Date('2018-01-01') })).toMatchSnapshot();
    });

    it('timeEnd filter', () => {
      expect(sql.many({ timeEnd: new Date('2018-01-02') })).toMatchSnapshot();
    });

    it('key filter', () => {
      expect(sql.many({ key: 'testboolF' })).toMatchSnapshot();
    });

    it('type and value', () => {
      expect(sql.many({ type: 'integer', value: 11 })).toMatchSnapshot();
    });

    it('sort desc', () => {
      expect(sql.many({ sort: 'desc' })).toMatchSnapshot();
    });

    it('limit', () => {
      expect(sql.many({ limit: 11 })).toMatchSnapshot();
    });
  });
});
