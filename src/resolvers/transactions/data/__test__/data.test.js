const createResolver = require('../');
const { parseDate } = require('../../../../utils/parseDate');

const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');
const mockDb = {
  transactions: { data: { many: filters => Task.of([Maybe.of(filters)]) } },
};
const resolverMany = createResolver.many({
  db: mockDb,
  emitEvent: () => () => null,
});

describe('Data transaction resolver for many', () => {
  // this time range contains 8 txs on testnet
  const timeStart = new Date('2018-06-07 08:26:00');
  const timeEnd = new Date('2018-06-07 08:50:00');

  describe('Validation ', () => {
    it('fails if timeEnd < 0', done =>
      resolverMany({
        timeEnd: parseDate('-1525132900000'),
        timeStart,
      })
        .run()
        .promise()
        .then(() => done('Wrong branch, error'))
        .catch(e => {
          expect(e.type).toBe('ValidationError');
          done();
        }));
    it('fails if timeStart < 0', done =>
      resolverMany({
        timeEnd,
        timeStart: parseDate('-1525132800000'),
      })
        .run()
        .promise()
        .then(() => done('Wrong branch, error'))
        .catch(e => {
          expect(e.type).toBe('ValidationError');
          done();
        }));
    it('fails if timeEnd < timeStart', done =>
      resolverMany({
        timeEnd: timeStart,
        timeStart: timeEnd,
      })
        .run()
        .promise()
        .then(() => done('Wrong branch, error'))
        .catch(e => {
          expect(e.type).toBe('ValidationError');
          done();
        }));
    it('fails if timeStart->invalid Date', done =>
      resolverMany({
        timeStart: parseDate(''),
      })
        .run()
        .promise()
        .then(() => done('Wrong branch, error'))
        .catch(e => {
          expect(e.type).toBe('ValidationError');
          done();
        }));

    it('fails if `type` is not one of `integer`, `boolean`, `string`, `binary`', done =>
      resolverMany({
        type: 'WRONG_TYPE',
        timeStart,
        timeEnd,
      })
        .run()
        .promise()
        .then(() => done('Wrong branch, error'))
        .catch(e => {
          expect(e.type).toBe('ValidationError');
          done();
        }));

    it('fails if `value` provided, but `type` is not', done =>
      resolverMany({
        value: 101,
        timeStart,
        timeEnd,
      })
        .run()
        .promise()
        .then(() => done('Wrong branch, error'))
        .catch(e => {
          expect(e.type).toBe('ValidationError');
          done();
        }));

    it('works if only timeEnd is presented', done =>
      resolverMany({
        timeEnd: new Date('2018-06-07 08:50:00'),
      })
        .run()
        .promise()
        .then(() => done())
        .catch(e => {
          expect(e.type).not.toBe('ValidationError');
          done();
        }));
  });
});
