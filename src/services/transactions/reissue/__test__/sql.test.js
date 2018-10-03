const sql = require('../sql');

describe('Sql builder', () => {
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
