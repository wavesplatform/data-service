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

  const defaults = {
    limit: 100,
    sort: 'desc',
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
      expect(parseQuery({})).toEqual(defaults);
    });

    it('ids are parsed correctly in any form', () => {
      expect(parseQuery({ ids: 'someValue' })).toEqual({
        ...defaults,
        ids: ['someValue'],
      });

      expect(parseQuery({ ids: '' })).toEqual({
        ...defaults,
        ids: [],
      });

      expect(parseQuery({ ids: 'qwe,asd' })).toEqual({
        ...defaults,
        ids: ['qwe', 'asd'],
      });
    });
  });

  it('extra input values are ignored', () => {
    expect(parseQuery({ badKey: 'badValue' })).toEqual(defaults);
  });
});
