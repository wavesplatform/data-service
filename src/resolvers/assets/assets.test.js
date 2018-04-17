const getAssets = require('./');
const { ResolverError } = require('../../utils/error');
const universalProxy = new Proxy(
  {},
  { get: () => universalProxy, toString: () => '', valueOf: () => 1 }
);
const apiMockImplementation = require('../../mocks/api');
const apiMock = {
  getAssets: jest.fn(apiMockImplementation.getAssets),
};

module.exports.apiMock = apiMock;

describe('Assets resolver', () => {
  beforeEach(() => apiMock.getAssets.mockClear());
  it('is function', () => {
    expect(typeof getAssets).toBe('function');
  });
  it('throws, if called without arguments', async () => {
    await expect(getAssets()).rejects.toBeInstanceOf(ResolverError);
  });
  it('throws, if called with anything without ids, api properties on itself', async () => {
    await expect(getAssets({ api: universalProxy })).rejects.toBeInstanceOf(
      ResolverError
    );
    await expect(getAssets({ ids: universalProxy })).rejects.toBeInstanceOf(
      ResolverError
    );
    await expect(getAssets(String(1))).rejects.toBeInstanceOf(ResolverError);
    await expect(getAssets(Number(1))).rejects.toBeInstanceOf(ResolverError);
    await expect(getAssets(Boolean(1))).rejects.toBeInstanceOf(ResolverError);
  });
  it('throw, if called with {ids: not string[], api: {}}', async () => {
    await expect(getAssets({ ids: [1], api: {} })).rejects.toBeInstanceOf(
      ResolverError
    );
    await expect(getAssets({ ids: [{}], api: {} })).rejects.toBeInstanceOf(
      ResolverError
    );
  });
  it('not throw, if called with {ids: string[], api: {getAssets}}', async () => {
    await expect(
      getAssets({ ids: ['1'], api: apiMock })
    ).resolves.toBeDefined();
  });
  it('calling api.getAssets with ids', async () => {
    const ids = ['1', '2', '3'];
    await getAssets({ ids, api: apiMock });
    expect(apiMock.getAssets).toBeCalledWith(ids);
  });
  it('throwing ResolverError if api throws', async () => {
    const api = {
      getAssets: jest.fn(() => {
        throw new Error('something wrong');
      }),
    };
    const ids = ['1'];
    await expect(getAssets({ ids, api })).rejects.toBeInstanceOf(ResolverError);
  });
});
