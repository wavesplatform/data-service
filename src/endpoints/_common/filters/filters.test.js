const {
  parseFilterValues,
  timeStart,
  timeEnd,
  limit,
  sort,
  after,
  ids,
} = require('.');

describe('Filter values parsing', () => {
  const filters = { timeStart, timeEnd, limit, sort, after, ids };
  const parseQuery = parseFilterValues(filters);

  const query = {
    ids: ['id1', 'id2'],
    timeStart: '2018-01-01',
    timeEnd: '2018-10-01',
    limit: '10',
    sort: 'asc',
    after: 'AFTER',
  };

  describe('all common filter', () => {
    it('values are parsed correctly provided correct values are given', () => {
      expect(parseQuery(query)).toEqual({
        ...query,
        timeStart: new Date(query.timeStart),
        timeEnd: new Date(query.timeEnd),
        limit: 10,
      });
    });
    it('correct default values are given ', () => {
      expect(
        expect(parseQuery({})).toEqual({
          limit: 100,
          sort: 'desc',
        })
      );
    });
  });

  it('extra input values are ignored', () => {
    expect(
      expect(parseQuery({ badKey: 'badValue' })).toEqual({
        limit: 100,
        sort: 'desc',
      })
    );
  });
});
