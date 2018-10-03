const Task = require('folktale/concurrency/task');
const { always, identity } = require('ramda');

const { parseDate } = require('../../../../../utils/parseDate');

const Joi = require('joi');

const searchWithPaginationPreset = require('..');
const commonFilterSchemas = require('../commonFilterSchemas');

const mockTxs = [
  { id: 'q', timestamp: new Date() },
  { id: 'w', timestamp: new Date() },
];
const service = searchWithPaginationPreset({
  name: 'some_name',
  sql: identity,
  inputSchema: Joi.object().keys(commonFilterSchemas),
  resultSchema: Joi.any(),
  transformResult: identity,
})({
  pg: { any: () => Task.of(mockTxs) },
  emitEvent: always(identity),
});

const assertValidationError = (done, v) =>
  service(v)
    .run()
    .promise()
    .then(() => done('Wrong branch, error'))
    .catch(e => {
      expect(e.type).toBe('ValidationError');
      done();
    });

describe('searchWithPagination preset validation', () => {
  describe('common filters', () => {
    it('fails if timeEnd < 0', done =>
      assertValidationError(done, {
        timeEnd: parseDate('-1525132900000'),
      }));
    it('fails if timeStart < 0', done =>
      assertValidationError(done, {
        timeEnd: parseDate('1525132900000'),
        timeStart: parseDate('-1525132800000'),
      }));
    it('fails if timeEnd < timeStart', done =>
      assertValidationError(done, {
        timeEnd: parseDate('1525132700000'),
        timeStart: parseDate('1525132800000'),
      }));
    it('fails if timeStart->invalid Date', done =>
      assertValidationError(done, {
        timeStart: parseDate(''),
      }));
    it('passes if correct object is provided', done =>
      service({
        timeStart: parseDate(0),
        timeEnd: parseDate(Date.now()),
        limit: 1,
        sort: 'asc',
      })
        .run()
        .listen({
          onResolved: x => {
            expect(x.__type).toBe('list');
            done();
          },
        }));
  });
});
