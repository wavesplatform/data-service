const List = require('../List');

const items = [{ id: 'qwe', f: 0 }, { id: 'asd', f: 1 }];

describe('List type should be', () => {
  it('constructed from array', () => {
    expect(List(items)).toEqual({
      __type: 'list',
      data: items,
    });
  });
  it('adds meta', () => {
    expect(List(items, { someValue: true })).toEqual({
      __type: 'list',
      data: items,
      someValue: true,
    });
  });
});
