const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');
const { identity } = require('ramda');

const createResolver = require('../resolver');
const { parseDate } = require('../../../../utils/parseDate');

const resolverOne = createResolver.one({
  db: identity,
  getData: id => Task.of(Maybe.of(id)),
  emitEvent: () => () => null,
});
const resolverSearch = createResolver.search({
  db: identity,
  getData: a => Task.of([Maybe.of(a), Maybe.Nothing()]),
  emitEvent: () => () => null,
});

describe('MassTransfer resolver validation', () => {
  const assertValidationError = (done, r, v) =>
    r(v)
      .run()
      .promise()
      .then(() => done('Wrong branch, error'))
      .catch(e => {
        expect(e.type).toBe('ValidationError');
        done();
      });
  const assertValidationPass = (done, r, v) =>
    r(v)
      .run()
      .promise()
      .then(() => done('Wrong branch, error'))
      .catch(e => {
        expect(e.type).toBe('ResolverError');
        done();
      });

  describe('one', () => {
    it('fails if /mass-transfer/{id} param is not provided', done =>
      assertValidationError(done, resolverOne));
    it('fails if /mass-transfer/{id} param is not a string', done => {
      assertValidationError(done, resolverOne, null);
      assertValidationError(done, resolverOne, 1);
      assertValidationError(done, resolverOne, {});
      assertValidationError(done, resolverOne, []);
    });
    it('passes if /mass-transfer/{id} param is a string', done =>
      assertValidationPass(done, resolverOne, 'someidgoeshere2942415'));
  });

  describe('many', () => {
    it('fails if timeEnd < 0', done =>
      assertValidationError(done, resolverSearch, {
        timeEnd: parseDate('-1525132900000'),
      }));
    it('fails if timeStart < 0', done =>
      assertValidationError(done, resolverSearch, {
        timeEnd: parseDate('1525132900000'),
        timeStart: parseDate('-1525132800000'),
      }));
    it('fails if timeEnd < timeStart', done =>
      assertValidationError(done, resolverSearch, {
        timeEnd: parseDate('1525132700000'),
        timeStart: parseDate('1525132800000'),
      }));
    it('fails if timeStart->invalid Date', done =>
      assertValidationError(done, resolverSearch, {
        timeStart: parseDate(''),
      }));
    it('passes if correct object is provided', done =>
      assertValidationPass(done, resolverSearch, {
        timeStart: parseDate(0),
        timeEnd: parseDate(Date.now()),
        limit: 1,
        sort: 'asc',
        sender: 'sender',
        assetId: 'assetId',
        recipient: 'recipient',
      }));
  });
});
