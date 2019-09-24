const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');
const { always, identity } = require('ramda');

const createService = require('..').default;

const service = createService({
  drivers: {
    pg: {
      oneOrNone: id => Task.of(Maybe.of(id)),
      any: () => Task.of(['1', '2', '3']),
    },
  },
  emitEvent: always(identity),
});

describe('Data transaction service', () => {
  describe('Validation ', () => {
    it('fails if `type` is not one of `integer`, `boolean`, `string`, `binary`', done =>
      service
        .search({ type: 'WRONG_TYPE' })
        .run()
        .promise()
        .then(() => done('Wrong branch, error'))
        .catch(e => {
          expect(e.type).toBe('Validation');
          done();
        }));

    it('fails if `value` provided, but `type` is not', done =>
      service
        .search({ value: 101 })
        .run()
        .promise()
        .then(() => done('Wrong branch, error'))
        .catch(e => {
          expect(e.type).toBe('Validation');
          done();
        }));
  });
});
