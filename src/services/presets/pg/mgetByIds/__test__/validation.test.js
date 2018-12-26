const Task = require('folktale/concurrency/task');
const { always, identity, equals } = require('ramda');

const Joi = require('joi');

const mgetByIdsPreset = require('..');
const { inputMget: input } = require('../inputSchema');

const createService = resultSchema =>
  mgetByIdsPreset({
    name: 'some_name',
    sql: identity,
    matchRequestResult: equals,
    inputSchema: input,
    resultSchema,
    transformResult: identity,
    resultTypeFactory: identity,
  })({
    pg: { any: ids => Task.of(ids) },
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

describe('mgetByIds', () => {
  describe('input validation', () => {
    // passing result validation
    const service = createService(Joi.any());

    it('fails if ids param is not provided', done =>
      assertValidationError(done, service));
    it('fails if ids params is not a base58 string array', done => {
      assertValidationError(done, service, null);
      assertValidationError(done, service, 1);
      assertValidationError(done, service, {});
      assertValidationError(done, service, ['1O']);
    });
    it('passes if ids param is an empty array', done =>
      service([])
        .run()
        .listen({
          onResolved: x => {
            expect(x.__type).toBe('list');
            done();
          },
        }));
    it('passes if ids param is a base58 string array', done =>
      service(['someidgoeshere2942415', 'qwe', 'asd'])
        .run()
        .listen({
          onResolved: x => {
            expect(x.__type).toBe('list');
            done();
          },
        }));
  });

  describe('result validation', () => {
    // failing result validation
    const service = createService(Joi.any().valid('qweasd'));

    it('applies schema correctly', done =>
      service(['someidgoeshere2942415'])
        .run()
        .listen({
          onRejected: e => {
            expect(e.type).toBe('ResolverError');
            done();
          },
        }));
  });
});
