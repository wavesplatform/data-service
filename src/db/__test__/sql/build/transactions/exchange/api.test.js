const { assoc, flatten, mapObjIndexed } = require('ramda');

const api = require('../../../../../sql/build/transactions/exchange/api');
const filters = require('../../../../../sql/build/transactions/exchange/filters');

const { equals } = require('ramda');

const isKnex = o => o.toSQL().method === 'select';
// checks that first call was with provided arg, second — with Knex object
const spyCalledWith = (spy, arg) =>
  equals(spy.mock.calls[0], [arg]) && isKnex(spy.mock.calls[1][0]);

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe('transactions.exchange api method', () => {
  describe('`one`', () => {
    it('should call `id` filter', () => {
      const idFilterSpy = jest.spyOn(filters, 'id');

      const sql = api({ filters });
      sql.one('EXCHANGE_TX_ID');
      expect(idFilterSpy.mock.calls[0][0]).toBe('EXCHANGE_TX_ID');
    });
  });

  describe('`many`', () => {
    it('should call `limit` filter', () => {
      const spy = jest.spyOn(filters, 'limit');
      const filtersSpied = assoc('limit', spy, filters);

      api({ filters: filtersSpied }).many({ limit: 50 });
      expect(spy).toHaveBeenLastCalledWith(50);
    });

    it('should call `matcher` filter', () => {
      // curried filter spy
      const spy = jest.fn(() => {
        if (spy.mock.calls.length >= 2)
          return filters.matcher(...flatten(spy.mock.calls));
        else return spy;
      });
      const filtersSpied = assoc('matcher', spy, filters);

      api({ filters: filtersSpied }).many({
        matcher: 'MATCHER_ADDR',
      });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spyCalledWith(spy, 'MATCHER_ADDR')).toBe(true);
    });

    it('should call `sender` filter', () => {
      const spy = jest.fn(() => {
        if (spy.mock.calls.length >= 2)
          return filters.sender(...flatten(spy.mock.calls));
        else return spy;
      });
      const filtersSpied = assoc('sender', spy, filters);

      api({ filters: filtersSpied }).many({
        sender: 'SENDER_ADDR',
      });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spyCalledWith(spy, 'SENDER_ADDR')).toBe(true);
    });

    it('should call `timeStart` filter', () => {
      const spy = jest.fn(() => {
        if (spy.mock.calls.length >= 2)
          return filters.timeStart(...flatten(spy.mock.calls));
        else return spy;
      });
      const filtersSpied = assoc('timeStart', spy, filters);

      const date = new Date('2018-01-01');

      api({ filters: filtersSpied }).many({
        timeStart: date,
      });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spyCalledWith(spy, date)).toBe(true);
    });

    it('should call `timeEnd` filter', () => {
      const spy = jest.fn(() => {
        if (spy.mock.calls.length >= 2)
          return filters.timeEnd(...flatten(spy.mock.calls));
        else return spy;
      });
      const filtersSpied = assoc('timeEnd', spy, filters);

      const date = new Date('2018-01-01');

      api({ filters: filtersSpied }).many({
        timeEnd: date,
      });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spyCalledWith(spy, date)).toBe(true);
    });

    it('should call `amountAsset` filter', () => {
      const spy = jest.fn(() => {
        if (spy.mock.calls.length >= 2)
          return filters.amountAsset(...flatten(spy.mock.calls));
        else return spy;
      });
      const filtersSpied = assoc('amountAsset', spy, filters);

      api({ filters: filtersSpied }).many({
        amountAsset: 'ASSET_ID',
      });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spyCalledWith(spy, 'ASSET_ID')).toBe(true);
    });

    it('should call `priceAsset` filter', () => {
      const spy = jest.fn(() => {
        if (spy.mock.calls.length >= 2)
          return filters.priceAsset(...flatten(spy.mock.calls));
        else return spy;
      });
      const filtersSpied = assoc('priceAsset', spy, filters);

      api({ filters: filtersSpied }).many({
        priceAsset: 'ASSET_ID',
      });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spyCalledWith(spy, 'ASSET_ID')).toBe(true);
    });

    it('should call corresponding filters for filter combinations', () => {
      const spies = {};
      const filtersSpied = mapObjIndexed((_, key) => {
        spies[key] = jest.fn(() => {
          if (spies[key].mock.calls.length >= 2)
            return filters[key](...flatten(spies[key].mock.calls));
          else return spies[key];
        });
        return spies[key];
      }, filters);

      const sql = api({ filters: filtersSpied });

      sql.many({ matcher: 'MATCHER_ADDR', sender: 'SENDER_ADDR' });
      // checking 2 calls of each filter (because of currying)
      expect(spyCalledWith(spies.matcher, 'MATCHER_ADDR')).toBe(true);
      expect(spyCalledWith(spies.sender, 'SENDER_ADDR')).toBe(true);

      // mocks are stateful, clearing manually
      jest.clearAllMocks();

      // time filters
      const range = {
        start: new Date('2018-01-01'),
        end: new Date('2018-01-02'),
      };
      sql.many({ timeStart: range.start, timeEnd: range.end });
      expect(spyCalledWith(spies.timeStart, range.start)).toBe(true);
      expect(spyCalledWith(spies.timeEnd, range.end)).toBe(true);
    });

    it('ignore filters that do not exist', () => {
      const spies = {};
      const filtersSpied = mapObjIndexed((_, key) => {
        spies[key] = jest.fn(() => {
          if (spies[key].mock.calls.length >= 2)
            return filters[key](...flatten(spies[key].mock.calls));
          else return spies[key];
        });
        return spies[key];
      }, filters);

      const sql = api({ filters: filtersSpied });

      sql.many({ badFilter1: 'VALUE_1', badFilter2: 'VALUE_2' });
      expect(spies.matcher).not.toHaveBeenCalled();
      expect(spies.sender).not.toHaveBeenCalled();
      expect(spies.timeStart).not.toHaveBeenCalled();
      expect(spies.timeEnd).not.toHaveBeenCalled();
      expect(spies.limit).not.toHaveBeenCalled();
    });
  });
});
