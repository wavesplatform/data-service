const Task = require('folktale/concurrency/task');

const Maybe = require('folktale/maybe');
const { driver } = require('../../../../db/__test__/mocks/index');

const create = require('../create');

afterEach(() => jest.clearAllMocks());

describe('Asset methods should correctly', () => {
  const dbManyResp = () => [1, 2, 3];
  const dbOneResp = () => [1];

  const deps = {
    batchQuery: () => x => x,
    sql: jest.fn(x => x),
  };
  // const dataBad = create({ ...deps, pg: driverTBad });

  // const goodAdapter = adapter.good(headSecondArg);
  // const badAdapter = adapter.bad(headSecondArg);

  it('resolve many', done => {
    const pg = driver.create(Task.of, dbManyResp);
    const pgAnySpy = jest.spyOn(pg, 'any');
    const data = create({ ...deps, pg });

    data
      .mget([1, 2, 3])
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toMatchSnapshot();
          expect(deps.sql).toHaveBeenCalledWith([1, 2, 3]);
          expect(pgAnySpy).toHaveBeenCalledWith([1, 2, 3]);
          done();
        },
      });
  });

  it('reject many', done => {
    const pg = driver.create(Task.rejected, dbManyResp);
    const pgAnySpy = jest.spyOn(pg, 'any');
    const data = create({ ...deps, pg });

    data
      .mget([1, 2, 3])
      .run()
      .listen({
        onRejected: e => {
          expect(e).toMatchSnapshot();
          expect(deps.sql).toHaveBeenCalledWith([1, 2, 3]);
          expect(pgAnySpy).toHaveBeenCalledWith([1, 2, 3]);
          done();
        },
      });
  });

  it('resolve one', done => {
    const pg = driver.create(Task.of, dbOneResp);
    const pgAnySpy = jest.spyOn(pg, 'any');
    const data = create({ ...deps, pg });

    data
      .get(1)
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toMatchSnapshot();
          expect(deps.sql).toHaveBeenCalledWith([1]);
          expect(pgAnySpy).toHaveBeenCalledWith([1]);
          done();
        },
      });
  });

  it('reject one', done => {
    const pg = driver.create(Task.rejected, dbOneResp);
    const pgAnySpy = jest.spyOn(pg, 'any');
    const data = create({ ...deps, pg });

    data
      .get(1)
      .run()
      .listen({
        onRejected: e => {
          expect(e).toMatchSnapshot();
          expect(deps.sql).toHaveBeenCalledWith([1]);
          expect(pgAnySpy).toHaveBeenCalledWith([1]);
          done();
        },
      });
  });
});
