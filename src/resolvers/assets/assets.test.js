const getAssets = require('./');
const { ResolverError } = require('../../utils/error');

// const { Either } = require('monet');

const { createDbAdapter } = require('../../db');
const { dbFail, dbSuccess, transformFn } = require('../../db/mocks/db');

const apiMock = {
  assets: jest.fn(createDbAdapter(dbSuccess).assets),
};

// assets(['q', 'w']) :: [{ id: 'q' }, { id: 'w' }]

describe('Assets resolver', () => {
  beforeEach(() => apiMock.assets.mockClear());
  it('is function', () => {
    expect(typeof getAssets).toBe('function');
  });

  it('calling api.getAssets with ids', async () => {
    const ids = ['1', '2', '3'];
    const exp = transformFn(ids);
    const task = getAssets({ ids, api: apiMock });

    const result = await task.run().promise();

    expect(result).toEqual(exp);
  });

  it.only('fails with wrong input', async () => {
    const ids = [1, 2, 3];
    const task = getAssets({ ids, api: apiMock });
    const resultP = task.run().promise();

    await resultP.catch(e => {
      expect(e.type).toBe('Validation');
    });
  });
});
