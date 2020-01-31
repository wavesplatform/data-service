const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');
const { always, identity } = require('ramda');

const createRepo = require('../').default;

const DEFAULT_TIMEOUT = 30000;

const repo = createRepo({
  drivers: {
    pg: {
      oneOrNone: id => Task.of(Maybe.of(id)),
      any: () => Task.of(['1', '2', '3']),
    },
  },
  emitEvent: always(identity),
  timeouts: {
    get: DEFAULT_TIMEOUT,
    mget: DEFAULT_TIMEOUT,
    search: DEFAULT_TIMEOUT,
    default: DEFAULT_TIMEOUT,
  },
});

describe('Data transaction repo', () => {
  describe('Resolver', () => {
    it('fails if `type` is not one of `integer`, `boolean`, `string`, `binary`', done =>
      repo
        .search({ type: 'WRONG_TYPE' })
        .run()
        .promise()
        .then(() => done('Wrong branch, error'))
        .catch(e => {
          expect(e.type).toBe('Resolver');
          done();
        }));

    it('fails if `value` provided, but `type` is not', done =>
      repo
        .search({ value: 101 })
        .run()
        .promise()
        .then(() => done('Wrong branch, error'))
        .catch(e => {
          expect(e.type).toBe('Resolver');
          done();
        }));
  });
});
