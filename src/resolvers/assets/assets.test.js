const getAssets = require('./');
const { ResolverError } = require('../../utils/error');
const universalProxy = new Proxy(
  { toString: () => 'str', valueOf: () => 1 },
  { get: (obj, prop) => (prop in obj ? obj[prop] : universalProxy) }
);
const { Either } = require('monet');
const apiMockImplementation = require('../../mocks/api');
const apiMock = {
  assets: jest.fn(apiMockImplementation.assets),
};

describe('Assets resolver', () => {
  beforeEach(() => apiMock.assets.mockClear());
  it('is function', () => {
    expect(typeof getAssets).toBe('function');
  });

  it('returns Left, if called without arguments', async () => {
    const result = await getAssets();
    expect(result.left()).toBeInstanceOf(ResolverError);
    expect(() => result.right()).toThrow();
  });
  it('returns Left, if called with anything without ids, api properties on itself', async () => {
    let result;

    result = await getAssets({ api: universalProxy });
    expect(result.left()).toBeInstanceOf(ResolverError);

    result = await getAssets({ ids: universalProxy });
    expect(result.left()).toBeInstanceOf(ResolverError);

    result = await getAssets(String(1));
    expect(result.left()).toBeInstanceOf(ResolverError);

    result = await getAssets(Number(1));
    expect(result.left()).toBeInstanceOf(ResolverError);

    result = await getAssets(Boolean(1));
    expect(result.left()).toBeInstanceOf(ResolverError);
  });
  it('returns Left, if called with wrong-schemed object', async () => {
    let result;

    result = await getAssets({ ids: [1], api: {} });
    expect(result.left()).toBeInstanceOf(ResolverError);

    result = await getAssets({ ids: [{}], api: {} });
    expect(result.left()).toBeInstanceOf(ResolverError);
  });
  it('returns Right, if called with {ids: string[], api: {getAssets}}', async () => {
    let result = await getAssets({ ids: ['1'], api: apiMock });
    expect(result.right()).toBeDefined();
    expect(() => result.left()).toThrow();
  });
  it.only('calling api.getAssets with ids', async () => {
    const ids = ['1', '2', '3'];
    const result = await getAssets({ ids, api: apiMock });
    expect(apiMock.assets).toBeCalledWith(ids);
    console.log(result.right());
    expect(result.right()).toEqual({ assets: ids.map(id => ({ id })) });
  });
  xit('throwing ResolverError if api throws', async () => {
    const api = {
      getAssets: jest.fn(() => {
        throw new Error('something wrong');
      }),
    };
    const ids = ['1'];
    await expect(getAssets({ ids, api })).rejects.toBeInstanceOf(ResolverError);
  });
});
