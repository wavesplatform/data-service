const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');
const { always, identity } = require('ramda');

const Joi = require('joi');

const getByIdPreset = require('..');

const createService = resultSchema =>
  getByIdPreset({
    name: 'some_name',
    sql: identity,
    resultSchema,
    transformResult: identity,
  })({
    pg: { oneOrNone: id => Task.of(Maybe.of(id)) },
    emitEvent: always(identity),
  });

const assertValidationError = (done, r, v) =>
  r(v)
    .run()
    .promise()
    .then(() => done('Wrong branch, error'))
    .catch(e => {
      expect(e.type).toBe('ValidationError');
      done();
    });

describe('getById', () => {
  describe('input validation', () => {
    // passing result validation
    const service = createService(Joi.any());

    it('fails if id param is not provided', done =>
      assertValidationError(done, service));
    it('fails if id param is not a string', done => {
      assertValidationError(done, service, null);
      assertValidationError(done, service, 1);
      assertValidationError(done, service, {});
      assertValidationError(done, service, []);
    });
    it('passes if id param is a string', done =>
      service('someidgoeshere2942415')
        .run()
        .listen({
          onResolved: x => {
            expect(x.__type).toBe('transaction');
            done();
          },
        }));
  });

  describe('result validation', () => {
    // failing result validation
    const service = createService(Joi.any().valid('qweasd'));

    it('applies schema correctly', done =>
      service('someidgoeshere2942415')
        .run()
        .listen({
          onRejected: e => {
            expect(e.type).toBe('ResolverError');
            done();
          },
        }));
  });
});
