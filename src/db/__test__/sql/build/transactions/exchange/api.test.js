const { assoc, flatten, mapObjIndexed } = require('ramda');

const api = require('../../../../../sql/build/transactions/exchange/api');
const query = require('../../../../../sql/build/transactions/exchange/query');
const filters = require('../../../../../sql/build/transactions/exchange/filters');

const P = require('../../../../../../utils/test/proxy/index');

describe('transactions.exchange api', () => {
  it('one by id', () => {
    const idFilterSpy = jest.spyOn(filters, 'id');

    const sql = api({ filters, query });
    sql.one('EXCHANGE_TX_ID');

    expect(idFilterSpy).toHaveBeenLastCalledWith('EXCHANGE_TX_ID', query);
    idFilterSpy.mockRestore();
  });

  it('limit filter', () => {
    const spy = jest.spyOn(filters, 'limit');
    const filtersSpied = assoc('limit', spy, filters);

    api({ query, filters: filtersSpied }).many();
    expect(spy).toHaveBeenLastCalledWith(100);

    api({ query, filters: filtersSpied }).many({ limit: 50 });
    expect(spy).toHaveBeenLastCalledWith(50);

    spy.mockRestore();
  });

  it('matcher filter', () => {
    // curried filter spy
    const spy = jest.fn(() => {
      if (spy.mock.calls.length >= 2)
        return filters.matcher(...flatten(spy.mock.calls));
      else return spy;
    });
    const filtersSpied = assoc('matcher', spy, filters);

    api({ query, filters: filtersSpied }).many({
      matcher: 'MATCHER_ADDR',
    });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls).toEqual([
      ['MATCHER_ADDR'],
      [filters.limit(100, query)], // limit filter applies
    ]);
    spy.mockClear();
  });

  it('sender filter', () => {
    const spy = jest.fn(() => {
      if (spy.mock.calls.length >= 2)
        return filters.sender(...flatten(spy.mock.calls));
      else return spy;
    });
    const filtersSpied = assoc('sender', spy, filters);

    api({ query, filters: filtersSpied }).many({
      sender: 'SENDER_ADDR',
    });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls).toEqual([
      ['SENDER_ADDR'],
      [filters.limit(100, query)], // limit filter applies
    ]);
    spy.mockClear();
  });

  it('timeStart filter', () => {
    const spy = jest.fn(() => {
      if (spy.mock.calls.length >= 2)
        return filters.timeStart(...flatten(spy.mock.calls));
      else return spy;
    });
    const filtersSpied = assoc('timeStart', spy, filters);

    const date = new Date('2018-01-01');

    api({ query, filters: filtersSpied }).many({
      timeStart: date,
    });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls).toEqual([
      [date],
      [filters.limit(100, query)], // limit filter applies
    ]);
    spy.mockClear();
  });

  it('timeEnd filter', () => {
    const spy = jest.fn(() => {
      if (spy.mock.calls.length >= 2)
        return filters.timeEnd(...flatten(spy.mock.calls));
      else return spy;
    });
    const filtersSpied = assoc('timeEnd', spy, filters);

    const date = new Date('2018-01-01');

    api({ query, filters: filtersSpied }).many({
      timeEnd: date,
    });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls).toEqual([
      [date],
      [filters.limit(100, query)], // limit filter applies
    ]);
    spy.mockClear();
  });

  it('filter combinations', () => {
    const spies = {};
    const queryMock = P.create({
      reservedFields: {
        length: 1,
      },
    });

    const filtersSpied = mapObjIndexed((_, key) => {
      spies[key] = jest.fn(() => {
        if (spies[key].mock.calls.length >= 2)
          return filters[key](...flatten(spies[key].mock.calls));
        else return spies[key];
      });
      return spies[key];
    }, filters);

    const sql = api({ filters: filtersSpied, query: queryMock });

    sql.many({ matcher: 'MATCHER_ADDR', sender: 'SENDER_ADDR' });
    // checking 2 calls of eack filter (because of currying)
    expect(spies.matcher.mock.calls.slice(-2)).toEqual([
      ['MATCHER_ADDR'],
      [queryMock],
    ]);
    expect(spies.sender.mock.calls.slice(-2)).toEqual([
      ['SENDER_ADDR'],
      [queryMock],
    ]);

    // time filters
    const range = {
      start: new Date('2018-01-01'),
      end: new Date('2018-01-02'),
    };
    sql.many({ timeStart: range.start, timeEnd: range.end });
    expect(spies.timeStart.mock.calls.slice(-2)).toEqual([
      [range.start],
      [queryMock],
    ]);
    expect(spies.timeEnd.mock.calls.slice(-2)).toEqual([
      [range.end],
      [queryMock],
    ]);
  });

  it('bad filters are ignored', () => {
    const spies = {};
    const filtersSpied = mapObjIndexed((_, key) => {
      spies[key] = jest.fn(() => {
        if (spies[key].mock.calls.length >= 2)
          return filters[key](...flatten(spies[key].mock.calls));
        else return spies[key];
      });
      return spies[key];
    }, filters);

    const sql = api({ filters: filtersSpied, query });

    sql.many({ badFilter1: 'VALUE_1', badFilter2: 'VALUE_2' });
    expect(spies.matcher).not.toHaveBeenCalled();
    expect(spies.sender).not.toHaveBeenCalled();
    expect(spies.timeStart).not.toHaveBeenCalled();
    expect(spies.timeEnd).not.toHaveBeenCalled();

    // limit is 100 by default
    expect(spies.limit.mock.calls).toEqual([[100], [query]]);
  });
});
