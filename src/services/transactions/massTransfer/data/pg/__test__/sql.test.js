const sql = require('../sql');
const filters = {
  sender: 'sender',
  recipient: 'recipient',
  timeStart: 'timeStart',
  timeEnd: 'timeEnd',
  sort: 'sort',
  limit: 1,
};
describe('Sql builder', () => {
  describe(' many', () => {
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
  describe(' one', () => {
    it('works', () => {
      expect(sql.one('id')).toMatchSnapshot();
    });
  });
});
