const pg = require('knex')({ client: 'pg' });

const { createSql } = require('..');

// sample query
const query = pg('some_table').select('*');
const filterValues = {
  sender: 'sender',
  timeStart: new Date('2020-01-01'),
  timeEnd: new Date('2020-02-01'),
  sort: 'desc',
  limit: 1,
};

const sql = createSql({ query });

describe('Sql builder', () => {
  describe('search', () => {
    it('covers case with all filters (without after)', () => {
      expect(sql.search(filterValues)).toMatchSnapshot();
    });
    it('covers case with all filters with after', () => {
      expect(
        sql.search({
          ...filterValues,
          after: {
            uid: 20000000,
            sort: 'sortDirection',
          },
        })
      ).toMatchSnapshot();
    });
  });
  describe(' get', () => {
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
