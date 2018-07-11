const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');

const { map, always, identity } = require('ramda');

const createData = require('../create');

const toJustResp = p => Maybe.of({ id: p });
const toNothingResp = () => Maybe.Nothing();
const mockEmitEvent = jest.fn(always(identity));

describe('Data module', () => {
  describe('get func', () => {
    const PAIR = 'p1';
    const createMockAdapter = transformFn => ({
      get: pair => Task.of(transformFn(pair)),
      cache: () => Task.of(null),
    });

    it('handles cache hit', done => {
      const hitCacheAdapter = createMockAdapter(toJustResp); // Task Maybe p
      const emptyPgAdapter = {}; // Task []

      const data = createData({
        redisAdapter: hitCacheAdapter,
        pgAdapter: emptyPgAdapter,
        emitEvent: mockEmitEvent,
      });

      data
        .get(PAIR)
        .run()
        .listen({
          onResolved: mX => {
            expect(mX).toEqual(toJustResp(PAIR));
            done();
          },
        });
    });

    it('does not call db on cache hit', done => {
      const hitCacheAdapter = createMockAdapter(toJustResp); // Task Maybe p
      const fullPgAdapter = createMockAdapter(toJustResp);

      const cacheSpy = jest.spyOn(hitCacheAdapter, 'get');
      const pgSpy = jest.spyOn(fullPgAdapter, 'get');

      const data = createData({
        redisAdapter: hitCacheAdapter,
        pgAdapter: fullPgAdapter,
        emitEvent: mockEmitEvent,
      });

      data
        .get(PAIR)
        .run()
        .listen({
          onResolved: () => {
            expect(cacheSpy).toHaveBeenCalledTimes(1);
            expect(pgSpy).not.toHaveBeenCalled();
            done();
          },
        });
    });

    it('handles cache miss', done => {
      const missCacheAdapter = createMockAdapter(toNothingResp);
      const fullPgAdapter = createMockAdapter(toJustResp);
      const cacheSpy = jest.spyOn(missCacheAdapter, 'get');
      const pgSpy = jest.spyOn(fullPgAdapter, 'get');

      const data = createData({
        redisAdapter: missCacheAdapter,
        pgAdapter: fullPgAdapter,
        emitEvent: mockEmitEvent,
      });

      data
        .get(PAIR)
        .run()
        .listen({
          onResolved: mX => {
            expect(mX).toEqual(toJustResp(PAIR));
            expect(cacheSpy).toHaveBeenCalledTimes(1);
            expect(pgSpy).toHaveBeenCalledTimes(1);
            done();
          },
        });
    });

    it('writes data to cache on cache miss', done => {
      const missCacheAdapter = createMockAdapter(toNothingResp);
      const fullPgAdapter = createMockAdapter(toJustResp);

      const cacheWriteSpy = jest.spyOn(missCacheAdapter, 'cache');

      const data = createData({
        redisAdapter: missCacheAdapter,
        pgAdapter: fullPgAdapter,
        emitEvent: mockEmitEvent,
      });

      data
        .get(PAIR)
        .run()
        .listen({
          onResolved: () => {
            expect(cacheWriteSpy).toHaveBeenCalledTimes(1);
            expect(cacheWriteSpy).toHaveBeenCalledWith([
              [PAIR, toJustResp(PAIR).getOrElse()],
            ]);
            done();
          },
        });
    });

    it('handles cache failure', done => {
      const failingCacheAdapter = {
        get: () => Task.rejected(-1),
        cache: () => Task.of(null),
      };
      const fullPgAdapter = createMockAdapter(toJustResp);

      const cacheSpy = jest.spyOn(failingCacheAdapter, 'get');
      const pgSpy = jest.spyOn(fullPgAdapter, 'get');

      const data = createData({
        redisAdapter: failingCacheAdapter,
        pgAdapter: fullPgAdapter,
        emitEvent: mockEmitEvent,
      });

      data
        .get(PAIR)
        .run()
        .listen({
          onResolved: mX => {
            expect(mX).toEqual(toJustResp(PAIR));
            expect(cacheSpy).toHaveBeenCalledTimes(1);
            expect(pgSpy).toHaveBeenCalledTimes(1);
            done();
          },
        });
    });

    it('fails on db failure', done => {
      const missCacheAdapter = createMockAdapter(toNothingResp);
      const failingPgAdapter = {
        get: () => Task.rejected(-1),
      };
      const cacheSpy = jest.spyOn(missCacheAdapter, 'get');
      const pgSpy = jest.spyOn(failingPgAdapter, 'get');

      const data = createData({
        redisAdapter: missCacheAdapter,
        pgAdapter: failingPgAdapter,
        emitEvent: mockEmitEvent,
      });

      data
        .get(PAIR)
        .run()
        .listen({
          onRejected: err => {
            expect(err).toEqual(-1);
            expect(cacheSpy).toHaveBeenCalledTimes(1);
            expect(pgSpy).toHaveBeenCalledTimes(1);
            done();
          },
        });
    });
  });

  describe('mget func', () => {
    const pairs = ['p1', 'p2', 'p3'];
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
