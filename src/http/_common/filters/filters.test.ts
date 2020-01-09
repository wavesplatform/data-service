import { parseFilterValues } from '.';
import commonParsers from './parsers';
import { SortOrder } from '../../../services/_common';

describe('Filter values parsing', () => {
  const parseQuery = parseFilterValues(commonParsers);

  const query = {
    ids: ['id1', 'id2'],
    timeStart: '2018-01-01',
    timeEnd: '2018-10-01',
    limit: '10',
    sort: SortOrder.Ascending,
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
    expect(parseQuery({ badKey: 'badValue' } as any)).toEqual(defaults);
  });
});
