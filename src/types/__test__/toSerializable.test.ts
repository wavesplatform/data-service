import { toSerializable } from '../serialization';

describe('toSerializable function', () => {
  it('should create a simple named type', () => {
    const MyType = toSerializable('my-type', 1);
    expect(MyType).toEqual({
      __type: 'my-type',
      data: 1,
    });
  });

  it('should provide `data: null` by default', () => {
    const MyType = toSerializable('my-type', null);
    expect(MyType).toEqual({
      __type: 'my-type',
      data: null,
    });
  });

  it('should create a type with custom default value', () => {
    const MyList = toSerializable('my-list', [1, 2, 3]);

    expect(MyList).toEqual({
      __type: 'my-list',
      data: [1, 2, 3],
    });
  });
});
