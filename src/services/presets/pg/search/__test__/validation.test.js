const Task = require('folktale/concurrency/task');
const { always, identity } = require('ramda');

const Joi = require('joi');

const { Transaction, list } = require('../../../../../types');
const search = require('..');

const mockTxs = [
  { id: 'q', timestamp: new Date() },
  { id: 'w', timestamp: new Date() },
];
const service = search({
  name: 'some_name',
  sql: identity,
  inputSchema: Joi.any(),
  resultSchema: Joi.any(),
  resultTypeFactory: Transaction,
  transformResult: identity(list),
})({
  pg: { any: () => Task.of(mockTxs) },
  emitEvent: always(identity),
});

describe('search preset validation', () => {
  describe('common filters', () => {
    it('passes if correct object is provided', done =>
      service({
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
