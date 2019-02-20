import createNamedType from '../createNamedType';

describe('createNamedType function', () => {
  it('should create a simple named type', () => {
    const MyType = createNamedType<number>('my-type');
    expect(MyType(1)).toEqual({
      __type: 'my-type',
      data: 1,
    });
  });

  it('should provide `data: null` by default', () => {
    const MyType = createNamedType<number>('my-type');
    expect(MyType()).toEqual({
      __type: 'my-type',
      data: null,
    });
  });

  it('should create a type with custom default value', () => {
    const MyList = createNamedType<number[]>('my-list', []);

    expect(MyList([1, 2, 3])).toEqual({
      __type: 'my-list',
      data: [1, 2, 3],
    });
    expect(MyList()).toEqual({
      __type: 'my-list',
      data: [],
    });
  });
});
