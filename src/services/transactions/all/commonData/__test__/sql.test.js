const sql = require('../sql');
const filters = {
  sender: 'sender',
  timeStart: 'timeStart',
  timeEnd: 'timeEnd',
  sort: 'sort',
  limit: 1,
};

describe('Sql builder', () => {
  describe('search', () => {
    it('covers case with all filters (without after)', () => {
      expect(sql.search(filters)).toMatchSnapshot();
    });
    it('covers case with all filters with after', () => {
      expect(
        sql.search({
          ...filters,
          after: {
            timestamp: 'timestamp',
            id: 'id',
            sortDirection: 'sortDirection',
          },
        })
      ).toMatchSnapshot();
    });
  });
  describe('get', () => {
    it('works', () => {
      expect(sql.get('id')).toMatchSnapshot();
    });
  });
  describe('mget', () => {
    it('works', () => {
      expect(sql.mget(['id1', 'id2'])).toMatchSnapshot();
    });
  });
});
