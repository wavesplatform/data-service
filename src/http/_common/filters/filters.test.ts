import { Ok as ok } from 'folktale/result';
import { parseFilterValues } from '.';
import { SortOrder } from '../../../services/_common';

describe('Filter values parsing', () => {
  const parseQuery = parseFilterValues({});

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
      expect(parseQuery(query)).toEqual(
        ok({
          ...query,
          timeStart: new Date(query.timeStart),
          timeEnd: new Date(query.timeEnd),
          limit: 10,
        })
      );
    });
    it('correct default values are given ', () => {
      expect(parseQuery({})).toEqual(ok(defaults));
    });

    it('ids are parsed correctly in any form', () => {
      expect(parseQuery({ ids: 'someValue' })).toEqual(
        ok({
          ...defaults,
          ids: ['someValue'],
        })
      );

      expect(parseQuery({ ids: '' })).toEqual(
        ok({
          ...defaults,
          ids: [],
        })
      );

      expect(parseQuery({ ids: 'qwe,asd' })).toEqual(
        ok({
          ...defaults,
          ids: ['qwe', 'asd'],
        })
      );
    });
  });

  it('extra input values are ignored', () => {
    expect(parseQuery({ badKey: 'badValue' } as any)).toEqual(ok(defaults));
  });
});
