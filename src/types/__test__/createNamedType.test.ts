import createNamedType from '../createNamedType';

describe('createNamedType function', () => {
  it('should create a simple named type', () => {
    const MyType = createNamedType('my-type', 1);
    expect(MyType).toEqual({
      __type: 'my-type',
      data: 1,
    });
  });

  it('should provide `data: null` by default', () => {
    const MyType = createNamedType('my-type', null);
    expect(MyType).toEqual({
      __type: 'my-type',
      data: null,
    });
  });

  it('should create a type with custom default value', () => {
    const MyList = createNamedType('my-list', [1, 2, 3]);

    expect(MyList).toEqual({
      __type: 'my-list',
      data: [1, 2, 3],
    });
  });
});
