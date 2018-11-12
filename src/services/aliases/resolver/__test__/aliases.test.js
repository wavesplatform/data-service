const createResolver = require('../');

const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');

const resolverOne = createResolver.one({
  db: { aliases: { one: a => Task.of(Maybe.of(a)) } },
  emitEvent: () => () => null,
});
const resolverMany = createResolver.many({
  db: { aliases: { many: a => Task.of([Maybe.of(a), Maybe.Nothing()]) } },
  emitEvent: () => () => null,
});

describe('Alias resolver validation', () => {
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
    it('fails if /alias/{alias} param is not provided', done =>
      assertValidationError(done, resolverOne));
    it('fails if /alias/{alias} param is not a string', done => {
      assertValidationError(done, resolverOne, null);
      assertValidationError(done, resolverOne, 1);
      assertValidationError(done, resolverOne, {});
      assertValidationError(done, resolverOne, []);
    });
    it('passes if /alias/{alias} param is a string', done =>
      assertValidationPass(done, resolverOne, 'alias'));
  });

  describe('many', () => {
    it('fails if /alias?address={address} param is not provided', done =>
      assertValidationError(done, resolverMany));
    it('fails if /alias?address={address} param is of a wrong type', done => {
      assertValidationError(done, resolverMany, null);
      assertValidationError(done, resolverMany, 1);
      assertValidationError(done, resolverMany, {});
      assertValidationError(done, resolverMany, []);
    });
    it('passes if correct object is provided', done =>
      assertValidationPass(done, resolverMany, { address: 'ADDR' }));
  });
});
