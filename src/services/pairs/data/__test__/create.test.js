const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/Maybe');

const { map, always, identity } = require('ramda');

const createData = require('../create');

const pairs = ['p1', 'p2', 'p3'];
const toJustResp = p => Maybe.of({ id: p });
const toNothingResp = () => Maybe.Nothing();

const mockEmitEvent = jest.fn(always(identity));

describe('Data module', () => {
  describe('mget func', () => {
    const createMockAdapter = transformFn => ({
      mget: pairs => Task.of(transformFn(pairs)),
      cache: () => Task.of(null),
    });

    it('handles full cache hit', done => {
      const fullCacheAdapter = createMockAdapter(map(toJustResp)); // Task Maybe p
      const emptyPgAdapter = createMockAdapter(() => []); // Task []

      const data = createData({
        pgAdapter: emptyPgAdapter,
        redisAdapter: fullCacheAdapter,
        emitEvent: mockEmitEvent,
      });

      data
        .mget(pairs)
        .run()
        .listen({
          onResolved: msX => {
            expect(msX).toEqual(map(toJustResp, pairs));
            done();
          },
        });
    });

    it('does not call db on full cache hit', done => {
      const fullCacheAdapter = createMockAdapter(map(toJustResp));
      const failingPgAdapter = { mget: () => Task.rejected(1) };

      const pgCallSpy = jest.spyOn(failingPgAdapter, 'mget');

      const data = createData({
        pgAdapter: failingPgAdapter,
        redisAdapter: fullCacheAdapter,
        emitEvent: mockEmitEvent,
      });

      data
        .mget(pairs)
        .run()
        .listen({
          onResolved: msX => {
            expect(pgCallSpy).not.toHaveBeenCalled();
            expect(msX).toEqual(map(toJustResp, pairs));
            done();
          },
        });
    });

    it('handles partial cache hit and partial db resp', done => {
      const partialCacheAdapter = createMockAdapter(
        map(x => (x === pairs[1] ? toNothingResp() : toJustResp(x)))
      );
      const partialPgAdapter = createMockAdapter(() => [toJustResp(pairs[1])]); // Task []

      const data = createData({
        pgAdapter: partialPgAdapter,
        redisAdapter: partialCacheAdapter,
        emitEvent: mockEmitEvent,
      });

      data
        .mget(pairs)
        .run()
        .listen({
          onResolved: msX => {
            expect(msX).toEqual(map(toJustResp, pairs));
            done();
          },
        });
    });

    it('handles zero cache hit and full db resp', done => {
      const zeroCacheAdapter = createMockAdapter(map(toNothingResp));
      const fullPgAdapter = createMockAdapter(map(toJustResp));

      const data = createData({
        pgAdapter: fullPgAdapter,
        redisAdapter: zeroCacheAdapter,
        emitEvent: mockEmitEvent,
      });

      data
        .mget(pairs)
        .run()
        .listen({
          onResolved: msX => {
            expect(msX).toEqual(map(toJustResp, pairs));
            done();
          },
        });
    });

    it('handles cache failure and full db resp', done => {
      const rejectingCacheAdapter = {
        mget: pairs => Task.rejected(pairs),
        cache: () => Task.of(null),
      };
      const fullPgAdapter = createMockAdapter(map(toJustResp));

      const data = createData({
        pgAdapter: fullPgAdapter,
        redisAdapter: rejectingCacheAdapter,
        emitEvent: mockEmitEvent,
      });

      data
        .mget(pairs)
        .run()
        .listen({
          onResolved: msX => {
            expect(msX).toEqual(map(toJustResp, pairs));
            done();
          },
        });
    });

    it('fails on db failure', done => {
      const fullPgAdapter = { mget: () => Task.rejected(1) };
      const zeroCacheAdapter = createMockAdapter(map(toNothingResp));

      const data = createData({
        pgAdapter: fullPgAdapter,
        redisAdapter: zeroCacheAdapter,
        emitEvent: mockEmitEvent,
      });

      data
        .mget(pairs)
        .run()
        .listen({
          onRejected: err => {
            expect(err).toEqual(1);
            done();
          },
        });
    });
  });
});
